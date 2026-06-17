import { createAdminClient } from '@/lib/supabase/server'

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

  const supabase = createAdminClient()
  const trimmedPhone = phone.trim()

  // Check for existing inquiry
  const { data: existingInquiries, error: existingError } = await supabase
    .from('inquiries')
    .select('id')
    .eq('phone', trimmedPhone)

  if (existingError) {
    return Response.json({ error: existingError.message }, { status: 500 })
  }

  if (existingInquiries && existingInquiries.length > 0) {
    return Response.json({ error: 'An inquiry with this phone number already exists.' }, { status: 400 })
  }

  // Direct insert - service role should bypass RLS
  const now = new Date().toISOString()
  const { error } = await supabase.from('inquiries').insert({
    name: name.trim(),
    email: email?.trim() || null,
    phone: trimmedPhone,
    message: message.trim(),
    product_interest: product_interest.trim(),
    created_at: now,
    updated_at: now,
  })

  if (error) {
    console.error('Insert error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
