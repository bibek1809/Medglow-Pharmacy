import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()
  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const { data, error: queryError } = await supabase.from('products').select('*').order('created_at')
  if (queryError) {
    return Response.json({ error: queryError.message }, { status: 500 })
  }

  return Response.json({ products: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { name, logo_url } = body || {}

  if (!name || !logo_url) {
    return Response.json({ error: 'Missing product name or logo_url' }, { status: 400 })
  }

  const { error: insertError } = await supabase.from('products').insert([
    { name, logo_url },
  ])

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { id, name, logo_url } = body || {}

  if (!id || !name || !logo_url) {
    return Response.json({ error: 'Missing product id, name, or logo_url' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('products')
    .update({ name, logo_url, updated_at: new Date() })
    .eq('id', id)

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { id } = body || {}

  if (!id) {
    return Response.json({ error: 'Missing product id' }, { status: 400 })
  }

  const { error: deleteError } = await supabase.from('products').delete().eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
