import { createClient } from '@/lib/supabase/server'

const isValidCustomerName = (name: string) => {
  const trimmed = name.trim()
  const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]{3,60}$/
  return pattern.test(trimmed)
}

const isValidEmail = (email: string) => {
  const trimmed = email.trim().toLowerCase()
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(trimmed)
}

const isValidPhoneNumber = (phone: string) => {
  const digits = String(phone).replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { name, email, phone, message, product_interest } = body || {}

  if (!name || !phone || !message || !product_interest) {
    return Response.json({ error: 'Missing inquiry fields' }, { status: 400 })
  }

  if (!isValidCustomerName(name)) {
    return Response.json({ error: 'Please enter a valid full name.' }, { status: 400 })
  }

  if (email && !isValidEmail(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!isValidPhoneNumber(phone)) {
    return Response.json({ error: 'Please enter a valid phone number with 7 to 15 digits.' }, { status: 400 })
  }

  const supabase = await createClient()
  const normalizedPhone = String(phone).replace(/\D/g, '')

  const { data: existingInquiries, error: existingError } = await supabase
    .from('inquiries')
    .select('phone')
    .not('phone', 'is', null)

  if (existingError) {
    return Response.json({ error: existingError.message }, { status: 500 })
  }

  if (existingInquiries?.some((record: any) => String(record.phone || '').replace(/\D/g, '') === normalizedPhone)) {
    return Response.json({ error: 'An inquiry with this phone number already exists. Please wait until it is reviewed or ask the admin to delete it.' }, { status: 400 })
  }

  const { error } = await supabase.from('inquiries').insert([
    {
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone.trim(),
      message: message.trim(),
      product_interest: product_interest.trim(),
    },
  ])

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
