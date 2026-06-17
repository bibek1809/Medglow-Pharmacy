import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { email, password } = body || {}

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 401 })
  }

  return Response.json({ success: true, user: data?.user?.email })
}
