import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'pharmacymedglow@gmail.com',
      password: '1809$abi',
      options: {
        data: {
          is_admin: true,
        },
      },
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({
      success: true,
      message: 'Admin user created',
      user: data.user?.email,
    })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
