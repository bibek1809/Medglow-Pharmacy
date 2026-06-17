import { createClient } from '@/lib/supabase/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return { error }
  }
  if (!data?.user || !(data.user.user_metadata as any)?.is_admin) {
    return { error: new Error('Admin access denied') }
  }
  return { user: data.user }
}

export async function GET() {
  const supabase = await createClient()
  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const { data, error: queryError } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (queryError) {
    return Response.json({ error: queryError.message }, { status: 500 })
  }

  return Response.json({ inquiries: data })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const { id, status } = body || {}

  if (!id || typeof status !== 'string') {
    return Response.json({ error: 'Missing inquiry id or status' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('inquiries')
    .update({ status, updated_at: new Date() })
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
    return Response.json({ error: 'Missing inquiry id' }, { status: 400 })
  }

  const { error: deleteError } = await supabase.from('inquiries').delete().eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
