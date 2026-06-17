import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { name, email, phone, message, product_interest } = body || {}

  if (!name || !phone || !message || !product_interest) {
    return Response.json({ error: 'Missing inquiry fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('inquiries').insert([
    {
      name,
      email,
      phone,
      message,
      product_interest,
    },
  ])

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
