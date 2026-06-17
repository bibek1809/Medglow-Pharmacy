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

  if (!name || !logo_url) {
    return Response.json({ error: 'Missing product name or logo_url' }, { status: 400 })
  }

  const adminClient = createAdminClient()
  const { error: insertError } = await adminClient.from('products').insert([
    { name, logo_url, type: type === 'listing' ? 'listing' : 'brand' },
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

  if (!id || !name || !logo_url) {
    return Response.json({ error: 'Missing product id, name, or logo_url' }, { status: 400 })
  }

  const adminClient = createAdminClient()
  const { error: updateError } = await adminClient
    .from('products')
    .update({
      name,
      logo_url,
      type: type === 'listing' ? 'listing' : 'brand',
      updated_at: new Date(),
    })
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
