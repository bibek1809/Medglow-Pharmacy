import { NextRequest } from 'next/server'

const MEDGLOW_INFO = {
  location: {
    address: 'Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal',
    postalCode: '44800',
    googleMaps: 'https://maps.app.goo.gl/PgU5XyrT5geDbR3p9',
    coordinates: { lat: '27.6833', lng: '85.3600' },
    landmarks: 'Near Harsha Chowk intersection, easy to spot with our pharmacy signage'
  },
  contact: {
    phone: '+977 9763259854',
    email: 'pharmacymedglow@gmail.com',
    whatsapp: 'https://wa.me/9779763259854',
    instagram: 'https://www.instagram.com/medglow.pharmacy.skincare',
    tiktok: 'https://www.tiktok.com/@medglowpharmacy.skincare'
  },
  hours: {
    open: '8:00 AM',
    close: '8:00 PM',
    days: 'Monday through Sunday'
  },
  delivery: {
    available: true,
    timeframe: '1-3 business days',
    areas: 'All across Nepal',
    methods: ['WhatsApp', 'Instagram', 'TikTok']
  }
}

const SKINCARE_KNOWLEDGE = {
  routines: {
    am: '1. Cleanser\n2. Toner\n3. Antioxidant Serum (Vitamin C)\n4. Moisturizer\n5. Sunscreen (SPF 30+)',
    pm: '1. Cleanser\n2. Toner\n3. Treatment Serum (Retinol/Niacinamide)\n4. Eye Cream\n5. Night Cream',
    oily: 'Use gel cleanser, alcohol-free toner, niacinamide serum, lightweight gel moisturizer, oil-free SPF. Avoid heavy creams.',
    brightening: 'Vitamin C or kojic acid serum, niacinamide, moisturizer, SPF 50+ in AM. Consistency is key.'
  }
}

function getSmartResponse(query: string): string {
  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery.includes('instagram') || lowerQuery.includes('@medglow')) {
    return `You can find us on Instagram at @medglow.pharmacy.skincare for daily skincare tips, product updates, and special offers!`
  }

  if (lowerQuery.includes('tiktok') || lowerQuery.includes('tik tok')) {
    return `Follow us on TikTok @medglowpharmacy.skincare for quick skincare tutorials, product demos, and pharmacy updates.`
  }

  if (lowerQuery.includes('map') || lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('dadhikot') || lowerQuery.includes('harsha chowk') || lowerQuery.includes('landmark')) {
    return `📍 Our Location:\n${MEDGLOW_INFO.location.address} (${MEDGLOW_INFO.location.postalCode})\n\nLandmark: ${MEDGLOW_INFO.location.landmarks}\n\nGoogle Maps: ${MEDGLOW_INFO.location.googleMaps}\nCoordinates: ${MEDGLOW_INFO.location.coordinates.lat}, ${MEDGLOW_INFO.location.coordinates.lng}`
  }

  if (lowerQuery.includes('delivery') || lowerQuery.includes('deliver') || lowerQuery.includes('shipping') || lowerQuery.includes('ship')) {
    return `📦 Delivery Information:\n• We deliver across ${MEDGLOW_INFO.delivery.areas}\n• Timeframe: ${MEDGLOW_INFO.delivery.timeframe}\n• Order via: ${MEDGLOW_INFO.delivery.methods.join(', ')}\n\nContact us on WhatsApp at ${MEDGLOW_INFO.contact.phone}.`
  }

  if (lowerQuery.includes('open') || lowerQuery.includes('hour') || lowerQuery.includes('time') || lowerQuery.includes('close')) {
    return `🕒 Opening Hours:\nWe're open ${MEDGLOW_INFO.hours.days} from ${MEDGLOW_INFO.hours.open} to ${MEDGLOW_INFO.hours.close}.`
  }

  if (lowerQuery.includes('routine') || lowerQuery.includes('daily skincare') || lowerQuery.includes('what is my skin care routine') || lowerQuery.includes('what should be daily routine')) {
    return `🌅 Your Daily Skincare Routine:\n\nMorning (AM):\n${SKINCARE_KNOWLEDGE.routines.am}\n\nEvening (PM):\n${SKINCARE_KNOWLEDGE.routines.pm}`
  }

  if (lowerQuery.includes('oily face') || lowerQuery.includes('oily skin') || lowerQuery.includes('acne prone') || lowerQuery.includes('oily')) {
    return `🧼 For Oily/Acne-Prone Skin:\n${SKINCARE_KNOWLEDGE.routines.oily}`
  }

  if (lowerQuery.includes('melasma') || lowerQuery.includes('hyperpigmentation')) {
    return `🎨 Melasma/Hyperpigmentation Treatment:\n${SKINCARE_KNOWLEDGE.routines.brightening}\n\nRequires strict SPF 50+ to prevent worsening. Hormonal triggers should also be managed.`
  }

  if (lowerQuery.includes('sunscreen') || lowerQuery.includes('spf')) {
    return `☀️ SPF is critical! UV rays trigger melanin production (dark spots). Apply SPF 30+ daily, even indoors. Reapply every 2 hours outdoors.`
  }

  if (lowerQuery.includes('glycolic acid') || lowerQuery.includes('kojic acid') || lowerQuery.includes('niacinamide') || lowerQuery.includes('retinoid') || lowerQuery.includes('retinol') || lowerQuery.includes('vitamin c') || lowerQuery.includes('hyaluronic acid')) {
    if (lowerQuery.includes('glycolic')) return `🔬 Glycolic Acid: An AHA exfoliant. Start with 5%, use 2-3 times weekly.`
    if (lowerQuery.includes('kojic')) return `🍊 Kojic Acid inhibits tyrosinase (melanin enzyme). Great for hyperpigmentation.`
    if (lowerQuery.includes('niacinamide')) return `✨ Niacinamide regulates oil, strengthens barrier, reduces inflammation.`
    if (lowerQuery.includes('retinoid') || lowerQuery.includes('retinol')) return `🌙 Retinoids boost cell turnover, collagen, and treat acne/aging. Start low frequency.`
    if (lowerQuery.includes('vitamin c')) return `🍋 Vitamin C is a potent antioxidant. Use in morning under sunscreen.`
    if (lowerQuery.includes('hyaluronic')) return `💦 Hyaluronic Acid holds 1000x its weight in water. Apply to damp skin.`
  }

  if (lowerQuery.includes('facewash') || lowerQuery.includes('face wash') || lowerQuery.includes('cleanser')) {
    return `🧼 Facewash Guide:\nUse twice daily. Gel for oily skin, cream for dry/sensitive. Rinse lukewarm.`
  }

  if (lowerQuery.includes('moisturizer') || lowerQuery.includes('cream')) {
    return `💧 Moisturizer hydrates and protects. Apply while skin is damp.`
  }

  if (lowerQuery.includes('toner')) {
    return `🌺 Toner balances skin pH and preps for absorption.`
  }

  if (lowerQuery.includes('serum')) {
    return `💉 Serums deliver concentrated actives. Apply after toner, before moisturizer.`
  }

  if (lowerQuery.includes('eye cream') || lowerQuery.includes('dark circle')) {
    return `👁️ Eye cream targets delicate under-eye area. Gently pat around orbital bone.`
  }

  return null
}

async function getChatGPTResponse(message: string): Promise<string | null> {
  const CHAT_GPT_TOKEN = process.env.CHAT_GPT_TOKEN
  if (!CHAT_GPT_TOKEN) return null

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAT_GPT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are GlowMaya, a skincare expert from MedGlow Pharmacy in Dadhikot, Nepal. Provide helpful, accurate skincare advice. Keep responses concise and polite. Always prioritize Medglow pharmacy services and products.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.choices?.[0]?.message?.content || null
    }
    return null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) {
      return Response.json({ error: 'No message provided' }, { status: 400 })
    }

    const smartResponse = getSmartResponse(message)
    if (smartResponse) {
      return Response.json({ reply: smartResponse })
    }

    const chatGPTResponse = await getChatGPTResponse(message)
    if (chatGPTResponse) {
      return Response.json({ reply: chatGPTResponse })
    }

    return Response.json({ reply: "I'm here to help! You can ask about location, delivery, opening hours, skincare routines, ingredients, or skin concerns. What would you like to know?" })
  } catch (error) {
    return Response.json({ error: 'Failed to process request' }, { status: 500 })
  }
}