import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = [
  process.env.SUPABASE_ADMIN_EMAIL ?? 'pharmacymedglow@gmail.com',
]

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

function isValidTitle(title: unknown) {
  return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 500
}

function isValidUrl(url: unknown) {
  if (typeof url !== 'string' || url.length === 0 || url.length > 2000) return false
  if (url.startsWith('/')) return true
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

function isValidHeadline(headline: unknown) {
  return typeof headline === 'string' && headline.trim().length <= 1000
}

export async function GET() {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const adminClient = createAdminClient()
  const { data, error: queryError } = await adminClient
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (queryError) {
    return Response.json({ error: queryError.message }, { status: 500 })
  }

  return Response.json({ news: data })
}

export async function POST(req: Request) {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { news_title, picture_link, headline, is_active } = body || {}

  if (!isValidTitle(news_title)) {
    return Response.json({ error: 'Invalid news_title' }, { status: 400 })
  }
  if (picture_link !== undefined && picture_link !== null && picture_link !== '' && !isValidUrl(picture_link)) {
    return Response.json({ error: 'Invalid picture_link URL' }, { status: 400 })
  }
  if (headline !== undefined && !isValidHeadline(headline)) {
    return Response.json({ error: 'Invalid headline' }, { status: 400 })
  }

  const adminClient = createAdminClient()
  const { data, error: insertError } = await adminClient
    .from('news')
    .insert([
      {
        news_title: (news_title as string).trim(),
        picture_link: picture_link ? String(picture_link).trim() : null,
        headline: headline ? String(headline).trim() : null,
        is_active: typeof is_active === 'boolean' ? is_active : true,
      },
    ])
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ news: data })
}

export async function PATCH(req: Request) {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { id, news_title, picture_link, headline, is_active } = body || {}

  if (!id || typeof id !== 'string') {
    return Response.json({ error: 'Missing news id' }, { status: 400 })
  }
  if (news_title !== undefined && !isValidTitle(news_title)) {
    return Response.json({ error: 'Invalid news_title' }, { status: 400 })
  }
  if (picture_link !== undefined && picture_link !== null && picture_link !== '' && !isValidUrl(picture_link)) {
    return Response.json({ error: 'Invalid picture_link URL' }, { status: 400 })
  }
  if (headline !== undefined && !isValidHeadline(headline)) {
    return Response.json({ error: 'Invalid headline' }, { status: 400 })
  }

  const updatePayload: Record<string, unknown> = { updated_at: new Date() }
  if (news_title !== undefined) updatePayload.news_title = (news_title as string).trim()
  if (picture_link !== undefined) updatePayload.picture_link = picture_link ? String(picture_link).trim() : null
  if (headline !== undefined) updatePayload.headline = headline ? String(headline).trim() : null
  if (is_active !== undefined) updatePayload.is_active = Boolean(is_active)

  const adminClient = createAdminClient()
  const { data, error: updateError } = await adminClient
    .from('news')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ news: data })
}

export async function DELETE(req: Request) {
  const sessionClient = await createClient()
  const { error } = await requireAdmin(sessionClient)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { id } = body || {}

  if (!id || typeof id !== 'string') {
    return Response.json({ error: 'Missing news id' }, { status: 400 })
  }

  const adminClient = createAdminClient()
  const { error: deleteError } = await adminClient.from('news').delete().eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
