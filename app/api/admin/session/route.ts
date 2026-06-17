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
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    return Response.json({ error: sessionError.message }, { status: 401 })
  }

  if (!sessionData?.session) {
    return Response.json({ error: 'No active admin session found' }, { status: 401 })
  }

  const { error } = await requireAdmin(supabase)
  if (error) {
    return Response.json({ error: error.message }, { status: 401 })
  }
  return Response.json({ authenticated: true })
}
