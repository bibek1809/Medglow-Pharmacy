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
    return Response.json({ error: error.message }, { status: 401 })
  }
  return Response.json({ authenticated: true })
}
