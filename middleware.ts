import { NextResponse, type NextRequest } from 'next/server'

const RATE_LIMIT_RULES = [
  { matcher: /^\/api\/admin\/login$/, limit: 5, windowMs: 60_000 },
  { matcher: /^\/api\/admin\//, limit: 30, windowMs: 60_000 },
  { matcher: /^\/api\/inquiries$/, limit: 20, windowMs: 60_000 },
  { matcher: /^\/api\//, limit: 40, windowMs: 60_000 },
]

const rateLimitStore = new Map<string, { count: number; firstRequestAt: number }>()
const CLEANUP_INTERVAL_MS = 10 * 60_000
let lastCleanup = Date.now()

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return (
    request.ip ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

function getRateLimitRule(pathname: string) {
  return RATE_LIMIT_RULES.find((rule) => rule.matcher.test(pathname))
}

function cleanupStore() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.firstRequestAt > 5 * 60_000) {
      rateLimitStore.delete(key)
    }
  }
  lastCleanup = now
}

function createSecurityHeaders() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'microphone=(), camera=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  }
}

function applyHeaders(response: NextResponse) {
  const headers = createSecurityHeaders()
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value)
  }
  return response
}

function tooManyRequestsResponse(limit: number, resetSeconds: number) {
  const response = NextResponse.json(
    {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please wait and try again.',
    },
    { status: 429 },
  )
  response.headers.set('Retry-After', String(resetSeconds))
  response.headers.set('X-RateLimit-Limit', String(limit))
  response.headers.set('X-RateLimit-Remaining', '0')
  response.headers.set('X-RateLimit-Reset', String(resetSeconds))
  return applyHeaders(response)
}

export function middleware(request: NextRequest) {
  cleanupStore()

  const pathname = request.nextUrl.pathname
  const rule = getRateLimitRule(pathname)
  if (rule) {
    const ip = getClientIp(request)
    const key = `${ip}:${rule.matcher}`
    const now = Date.now()
    const entry = rateLimitStore.get(key)

    if (!entry || now - entry.firstRequestAt > rule.windowMs) {
      rateLimitStore.set(key, { count: 1, firstRequestAt: now })
    } else {
      const nextCount = entry.count + 1
      if (nextCount > rule.limit) {
        const resetSeconds = Math.ceil((rule.windowMs - (now - entry.firstRequestAt)) / 1000)
        return tooManyRequestsResponse(rule.limit, resetSeconds)
      }
      rateLimitStore.set(key, { count: nextCount, firstRequestAt: entry.firstRequestAt })
    }
  }

  const response = NextResponse.next()
  return applyHeaders(response)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
}
