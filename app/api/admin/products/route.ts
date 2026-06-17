import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = [
  process.env.SUPABASE_ADMIN_EMAIL ?? 'pharmacymedglow@gmail.com',
]

// Validation and security helpers
const MAX_NAME_LENGTH = 200
const MAX_URL_LENGTH = 1000
const ALLOWED_IMAGE_HOSTS = new Set([
  'cdn.corenexis.com',
  'hebbkx1anhila5yf.public.blob.vercel-storage.com',
])

function isValidName(name: unknown) {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    name.trim().length <= MAX_NAME_LENGTH
  )
}

function isValidLogoUrl(url: unknown) {
  if (typeof url !== 'string' || url.length === 0 || url.length > MAX_URL_LENGTH) return false

  // Allow relative paths like `/logos/foo.png`
  if (url.startsWith('/')) {
    // disallow path traversal
    return !url.includes('..')
  }

  // Allow only absolute http/https URLs from known hosts
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false
    return ALLOWED_IMAGE_HOSTS.has(u.hostname)
  } catch (e) {
    return false
  }
}

function isValidType(t: unknown) {
  return t === 'brand' || t === 'listing'
}

function isValidUUID(id: unknown) {
  if (typeof id !== 'string') return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
}

function isAdminUser(user: any) {
  return (
    (user.user_metadata as any)?.is_admin === true ||
    ADMIN_EMAILS.includes(user.email || '')
  )
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return { error }
  }
  const user = data?.user
  if (!user || !isAdminUser(user)) {
    return { error: new Error('Admin access denied') }
  }
  return { user }
}

export async function GET() {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const adminClient = createAdminClient()
  const { data, error: queryError } = await adminClient.from('products').select('*').order('created_at')
  if (queryError) {
    return Response.json({ error: queryError.message }, { status: 500 })
  }

  return Response.json({ products: data })
}

export async function POST(req: Request) {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }
  const body = await req.json().catch(() => null)
  const { name, logo_url, type } = body || {}

  // Validate inputs to avoid malformed data and reduce risk of injection
  if (!isValidName(name) || !isValidLogoUrl(logo_url)) {
    return Response.json({ error: 'Invalid product name or logo_url' }, { status: 400 })
  }

  const safeType = isValidType(type) ? (type as 'brand' | 'listing') : 'brand'

  const adminClient = createAdminClient()
  const { error: insertError } = await adminClient.from('products').insert([
    { name: (name as string).trim(), logo_url: (logo_url as string).trim(), type: safeType },
  ])

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}

export async function PATCH(req: Request) {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }
  const body = await req.json().catch(() => null)
  const { id, name, logo_url, type } = body || {}

  if (!isValidUUID(id) || !isValidName(name) || !isValidLogoUrl(logo_url)) {
    return Response.json({ error: 'Invalid id, product name, or logo_url' }, { status: 400 })
  }

  const adminClient = createAdminClient()
  const updatePayload: any = { name: (name as string).trim(), logo_url: (logo_url as string).trim(), updated_at: new Date() }
  if (isValidType(type)) updatePayload.type = type

  const { error: updateError } = await adminClient
    .from('products')
    .update(updatePayload)
    .eq('id', id)

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { id } = body || {}

  if (!id) {
    return Response.json({ error: 'Missing product id' }, { status: 400 })
  }

  const adminClient = createAdminClient()
  const { error: deleteError } = await adminClient.from('products').delete().eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
