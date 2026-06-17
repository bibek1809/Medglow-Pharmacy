'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Leaf, MapPin, Truck, Minimize2, Maximize2 } from 'lucide-react'

type Message = {
  id: string
  text: string
  isBot: boolean
}

const MEDGLOW_INFO = {
  location: {
    address: 'Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal',
    postalCode: '44800',
    googleMaps: 'https://maps.app.goo.gl/PgU5XyrT5geDbR3p9',
    coordinates: { lat: '27.6833', lng: '85.3600' },
    landmarks: 'Near Harsha Chowk intersection, easy to spot with our pharmacy signage',
    directions: 'From Kathmandu: Take Araniko Highway, turn at Suryabinayak, follow signs to Harsha Chowk'
  },
  contact: {
    phone: '+977 9763259854',
    email: 'pharmacymedglow@gmail.com',
    whatsapp: 'https://wa.me/9779763259854',
    instagram: 'https://www.instagram.com/medglow.pharmacy.skincare',
    tiktok: 'https://www.tiktok.com/@medglowpharmacy.skincare',
    responseTime: 'Within 1-2 hours during business hours'
  },
  hours: {
    open: '8:00 AM',
    close: '8:00 PM',
    days: 'Monday through Sunday',
    holidays: 'Closed on major Nepali holidays'
  },
  delivery: {
    available: true,
    timeframe: '1-3 business days',
    areas: 'All across Nepal',
    methods: ['WhatsApp', 'Instagram', 'TikTok'],
    freeDelivery: 'Orders above NPR 1000 get free delivery',
    cod: 'Cash on delivery available'
  },
  services: {
    prescription: 'Full prescription fulfillment',
    consultation: 'Free skincare consultation',
    bloodTest: 'On-site blood testing services',
    babyCare: 'Curated baby care products',
    vitamins: 'Wide range of vitamins and supplements',
    firstAid: 'Complete first aid supplies',
    elderlyCare: 'Specialized elderly care products'
  },
  payment: {
    methods: ['Cash', 'Esewa', 'Khalti', 'Bank Transfer'],
    accepted: 'All major digital wallets and cards accepted'
  },
  mission: 'Your trusted partner for safe, effective skincare and pharmaceutical care in Nepal'
}

const SKINCARE_KNOWLEDGE = {
  skinTypes: {
    oily: 'Characterized by excess sebum, enlarged pores, and acne-prone. Use gel cleansers, niacinamide, salicylic acid, and oil-free products.',
    dry: 'Flaky, tight, and dull appearance. Needs rich moisturizers, hyaluronic acid, and cream-based products.',
    combination: 'Oily T-zone, dry cheeks. Balance with different products for different zones.',
    sensitive: 'Easily irritated, red, or reactive. Choose fragrance-free, minimal ingredient formulas.',
    normal: 'Balanced skin with minimal concerns. Simple routine with antioxidant protection works well.'
  },
  routineOrder: 'Cleanser → Toner → Serum → Moisturizer → Sunscreen (AM)',
  skinLayers: {
    stratumCorneum: 'Outermost layer acting as barrier. Damage causes TEWL and moisture loss.',
    dermis: 'Contains collagen, elastin, and blood vessels. Target for anti-aging treatments.',
    hypodermis: 'Fat layer for cushioning.'
  },
  actives: {
    retinoids: 'Vitamin A derivatives promoting cell turnover and collagen. Start low, gradual introduction.',
    vitaminC: 'Antioxidant protecting from free radicals. Use in AM for sun protection.',
    niacinamide: 'B3 regulating sebum, strengthening barrier, and evening tone.',
    hyaluronicAcid: 'Humectant holding 1000x weight in water. Hydrates at all depths.',
    peptides: 'Signal peptides boosting collagen and repair.',
    ceramides: 'Lipids restoring barrier function and preventing TEWL.',
    alphaArbutin: 'Safe brightening alternative to hydroquinone. Reduces melanin production.',
    salicylicAcid: 'BHA exfoliating inside pores. Oil-soluble for acne treatment.',
    lacticAcid: 'AHA gentle exfoliant for sensitive types.',
    benzoylPeroxide: 'Antibacterial for acne. Can dry - use sparingly.',
    glycolicAcid: 'AHA exfoliant dissolving dead skin bonds. 5-10% for beginners.',
    kojicAcid: 'Brightening agent inhibiting tyrosinase enzyme. Great for dark spots.',
    azelaicAcid: 'Multi-tasking: anti-acne, anti-inflammatory, brightening. Safe for sensitive.',
    vitaminE: 'Antioxidant protecting skin lipids from oxidative damage.',
    ferulicAcid: 'Enhances vitamin C stability and efficacy.',
    squalane: 'Lightweight emollient mimicking skin natural oils.',
    panthenol: 'B5 soothing and hydrating ingredient.',
    centellaAsiatica: 'Cica for soothing irritated skin and promoting repair.',
    greenTea: 'EGCG antioxidant with anti-inflammatory properties.'
  },
  concerns: {
    acne: ' Caused by bacteria, hormones, or occlusion. Treat with salicylic acid, niacinamide, and non-comedogenic products.',
    hyperpigmentation: 'Dark spots from inflammation or UV. Treat with vitamin C, kojic acid, and SPF.',
    melasma: 'Hormonal and sun-triggered. Requires strict SPF, vitamin C, and kojic acid.',
    aging: 'Loss of collagen, elastin, and hydration. Treat with retinoids, peptides, and sunscreen.',
    rosacea: 'Chronic redness and visible blood vessels. Avoid triggers, use gentle products.',
    eczema: 'Inflammatory barrier condition. Requires moisture and steroid treatment.',
    darkCircles: 'Can be genetic, lifestyle, or pigmentation-related. Use vitamin C, peptides, sleep well.',
    puffyEyes: 'Morning swelling from fluid retention, salt intake, or lack of sleep. Use cold products.',
    enlargedPores: 'Often oily skin related. Retinoids, niacinamide, BHA help minimize appearance.',
    blackheads: 'Open comedones from clogged pores. BHA and retinoids work well.',
    whiteheads: 'Closed comedones under skin. AHA and retinoids help.',
    redness: 'Sensitive or reactive skin. Use cooling ingredients and avoid irritants.',
    dehydration: 'TEWL from compromised barrier. Hyaluronic acid and moisturizers help.',
    dullness: 'Dead skin accumulation. Exfoliation and vitamin C restore glow.'
  },
  routines: {
    am: '1. Cleanser\n2. Toner\n3. Antioxidant Serum (Vitamin C)\n4. Moisturizer\n5. Sunscreen (SPF 30+)',
    pm: '1. Cleanser\n2. Toner\n3. Treatment Serum (Retinol/Niacinamide)\n4. Eye Cream\n5. Night Cream',
    oily: 'Use gel cleanser, alcohol-free toner, niacinamide serum, lightweight gel moisturizer, oil-free SPF. Avoid heavy creams.',
    sensitive: 'Use cream cleanser, hydrating toner, ceramide serum, fragrance-free moisturizer, mineral SPF.',
    antiAging: 'Retinol or peptides at night, vitamin C in morning, sunscreen daily, hyaluronic acid for hydration.',
    brightening: 'Vitamin C or kojic acid serum, niacinamide, moisturizer, SPF 50+ in AM. Consistency is key.',
    acneProne: 'Salicylic acid cleanser, niacinamide, lightweight moisturizer, oil-free SPF. Spot treat with benzoyl peroxide.',
    dry: 'Cream cleanser, hydrating toner, hyaluronic acid, rich moisturizer, SPF. Avoid alcohol and fragrances.',
    normal: 'Gentle cleanser, balanced toner, antioxidant serum, daily moisturizer, SPF 30+.'
  },
  ingredients: {
    aha: 'Alpha Hydroxy Acids (glycolic, lactic) exfoliate surface skin. Use PM, start 2-3x weekly.',
    bha: 'Beta Hydroxy Acid (salicylic) exfoliates inside pores. Good for acne and blackheads.',
    retinol: 'Gradually introduce. Start 1-2x weekly, increase. Avoid with AHA/BHA same session.',
    peptides: 'Short-chain amino acids signaling skin to produce more collagen.',
    spf: 'Sun Protection Factor. UV causes 80% of visible aging. Reapply every 2 hours.',
    niacinamide: 'Multi-tasking: oil control, barrier, brightening, anti-inflammatory. Pairs with everything.',
    vitaminC: 'Antioxidant, brightening, collagen support. Use AM with SPF.',
    ceramides: 'Barrier lipids preventing moisture loss. Essential for sensitive/dry skin.'
  },
  applicationTips: {
    layering: 'Apply thinnest to thickest consistency. Wait 30-60 seconds between layers.',
    frequency: 'Start new products 1-2x weekly, gradually increase. Patch test behind ear.',
    mixing: 'Do not mix retinoids with vitamin C. Do not mix AHA/BHA with retinoids.',
    timing: 'Active ingredients in PM. Antioxidants in AM. Consistent daily use is key.',
    patchTest: 'Test behind ear or inner arm for 2 days before full-face application.'
  },
  seasonalCare: {
    summer: 'Lighter moisturizers, higher SPF, more hydration, avoid heavy occlusives.',
    winter: 'Rich moisturizers, barrier support, gentle cleansing, humidifier indoors.',
    monsoon: 'Antifungal prevention, extra cleansing, oil-control products for humidity.'
  },
  lifestyle: {
    sleep: '7-9 hours nightly for skin repair and regeneration.',
    hydration: 'Drink 2-3 liters water daily for skin hydration.',
    diet: 'Antioxidant-rich foods (berries, leafy greens) support skin health.',
    stress: 'High stress increases cortisol, worsening acne and aging.',
    exercise: 'Sweating cleans pores. Cleanse after workout to prevent clogged pores.'
  }
}

export default function GlowMayaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm GlowMaya, your skincare assistant from MedGlow Pharmacy. I'm here to help with any skincare questions or information about our pharmacy. What can I assist you with today?",
      isBot: true
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const responseCache = useRef<Map<string, string>>(new Map())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase().trim()
    
    // Try local fallback first for instant response
    const fallback = getFallbackResponse(query)
    if (fallback !== "I'm here to help! Ask about location, delivery, hours, skincare routines, ingredients, skin concerns, or our services.") {
      return fallback
    }
    
    // Only hit API for complex queries
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        const reply = data.reply || fallback
        responseCache.current.set(query.toLowerCase(), reply)
        return reply
      }
      return fallback
    } catch {
      return fallback
    }
  }

  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim()

    if (lowerQuery.includes('instagram') || lowerQuery.includes('@medglow')) {
      return `You can find us on Instagram at @medglow.pharmacy.skincare for daily skincare tips, product updates, and special offers!`
    }

    if (lowerQuery.includes('tiktok') || lowerQuery.includes('tik tok')) {
      return `Follow us on TikTok @medglowpharmacy.skincare for quick skincare tutorials, product demos, and pharmacy updates.`
    }

    if (lowerQuery.includes('map') || lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('dadhikot') || lowerQuery.includes('harsha chowk') || lowerQuery.includes('landmark') || lowerQuery.includes('direction')) {
      return `📍 Our Location:\n${MEDGLOW_INFO.location.address} (${MEDGLOW_INFO.location.postalCode})\n\nLandmark: ${MEDGLOW_INFO.location.landmarks}\n\nGoogle Maps: ${MEDGLOW_INFO.location.googleMaps}\nCoordinates: ${MEDGLOW_INFO.location.coordinates.lat}, ${MEDGLOW_INFO.location.coordinates.lng}`
    }

    if (lowerQuery.includes('delivery') || lowerQuery.includes('deliver') || lowerQuery.includes('shipping') || lowerQuery.includes('ship') || lowerQuery.includes('order online') || lowerQuery.includes('cash on delivery') || lowerQuery.includes('cod')) {
      let response = `📦 Delivery Information:\n• We deliver across ${MEDGLOW_INFO.delivery.areas}\n• Timeframe: ${MEDGLOW_INFO.delivery.timeframe}\n• Order via: ${MEDGLOW_INFO.delivery.methods.join(', ')}`
      if (MEDGLOW_INFO.delivery.freeDelivery) response += `\n• ${MEDGLOW_INFO.delivery.freeDelivery}`
      if (MEDGLOW_INFO.delivery.cod) response += `\n• ${MEDGLOW_INFO.delivery.cod}`
      response += `\n\nContact us on WhatsApp at ${MEDGLOW_INFO.contact.phone} to place your order!`
      return response
    }

    if (lowerQuery.includes('open') || lowerQuery.includes('hour') || lowerQuery.includes('time') || lowerQuery.includes('close') || lowerQuery.includes('opening') || lowerQuery.includes('holiday')) {
      return `🕒 Opening Hours:\nWe're open ${MEDGLOW_INFO.hours.days} from ${MEDGLOW_INFO.hours.open} to ${MEDGLOW_INFO.hours.close}.\n${MEDGLOW_INFO.hours.holidays}\n\nWalk-ins welcome! Whatsapp: ${MEDGLOW_INFO.contact.phone}`
    }

    if (lowerQuery.includes('routine') || lowerQuery.includes('daily skincare') || lowerQuery.includes('what is my skin care routine') || lowerQuery.includes('what should be daily routine') || lowerQuery.includes('morning routine') || lowerQuery.includes('night routine')) {
      return `🌅 Your Daily Skincare Routine:\n\nMorning (AM):\n${SKINCARE_KNOWLEDGE.routines.am}\n\nEvening (PM):\n${SKINCARE_KNOWLEDGE.routines.pm}`
    }

    if (lowerQuery.includes('oily face') || lowerQuery.includes('oily skin') || lowerQuery.includes('acne prone') || lowerQuery.includes('oily')) {
      return `🧼 For Oily/Acne-Prone Skin:\n${SKINCARE_KNOWLEDGE.routines.oily}\n\nAcne is caused by bacteria, hormones, or occlusion. Use salicylic acid, niacinamide, and non-comedogenic products.`
    }

    if (lowerQuery.includes('sensitive skin') || lowerQuery.includes('redness') || lowerQuery.includes('irritated')) {
      return `🌸 For Sensitive Skin:\n${SKINCARE_KNOWLEDGE.routines.sensitive}\n\nChoose fragrance-free products. Always patch test new products.`
    }

    if (lowerQuery.includes('dry skin') || lowerQuery.includes('dehydrated') || lowerQuery.includes('flaky')) {
      return `💧 For Dry/Dehydrated Skin:\n${SKINCARE_KNOWLEDGE.routines.dry}\n\nApply moisturizers to damp skin. Look for hyaluronic acid and ceramides.`
    }

    if (lowerQuery.includes('melasma') || lowerQuery.includes('hyperpigmentation') || lowerQuery.includes('dark spot') || lowerQuery.includes('pigmentation')) {
      return `🎨 Melasma/Hyperpigmentation Treatment:\n${SKINCARE_KNOWLEDGE.routines.brightening}\n\nBoth require strict SPF 50+ to prevent worsening. Hormonal triggers should also be managed.`
    }

    if (lowerQuery.includes('anti aging') || lowerQuery.includes('wrinkle') || lowerQuery.includes('aging') || lowerQuery.includes('fine line')) {
      return `🌙 Anti-Aging Routine:\n${SKINCARE_KNOWLEDGE.routines.antiAging}\n\nStart early! Prevention is easier than correction. Consistent use shows results in 6-8 weeks.`
    }

    if (lowerQuery.includes('sunscreen') || lowerQuery.includes('spf') || lowerQuery.includes('sun block') || lowerQuery.includes('sunblock') || lowerQuery.includes('why sunscreen')) {
      return `☀️ SPF is critical! UV rays trigger melanin production (dark spots). Apply SPF 30+ daily, even indoors. Reapply every 2 hours outdoors.\n\nMedglow carries broad-spectrum sunscreens suitable for all skin types.`
    }

    if (lowerQuery.includes('glycolic acid')) {
      return `🔬 Glycolic Acid: An AHA exfoliant that dissolves dead skin bonds. Start with 5%, use 2-3 times weekly. Improves texture and brightness.`
    }

    if (lowerQuery.includes('kojic acid') || lowerQuery.includes('koijc') || lowerQuery.includes('arbutin')) {
      return `🍊 Kojic Acid inhibits tyrosinase (melanin enzyme). Great for hyperpigmentation and melasma.\n\nMay cause initial purging - be consistent for 4-6 weeks to see results.`
    }

    if (lowerQuery.includes('niacinamide')) {
      return `✨ Niacinamide (Vitamin B3) regulates oil, strengthens barrier, reduces inflammation, and improves skin tone. Works with Vitamin C.`
    }

    if (lowerQuery.includes('retinoid') || lowerQuery.includes('retinol') || lowerQuery.includes('retinaldehyde')) {
      return `🌙 Retinoids (Vitamin A) boost cell turnover, collagen, and treat acne/aging. Start low frequency (2-3x weekly), increase gradually.\n\nNever use with benzoyl peroxide.`
    }

    if (lowerQuery.includes('vitamin c')) {
      return `🍋 Vitamin C is a potent antioxidant protecting from free radicals. Use in morning under sunscreen. Brightens, firms, and supports collagen.`
    }

    if (lowerQuery.includes('hyaluronic acid')) {
      return `💦 Hyaluronic Acid holds 1000x its weight in water. Provides hydration at all skin depths. Works for ALL skin types!`
    }

    if (lowerQuery.includes('salicylic acid') || lowerQuery.includes('bha') || lowerQuery.includes('benzoyl peroxide')) {
      return `🎯 BHA/Salicylic Acid: Oil-soluble exfoliant for deep pore cleaning. Perfect for acne, blackheads, and oily skin.\n\nBenzoyl Peroxide: Antibacterial for acne. Use sparingly (2.5-5%).`
    }

    if (lowerQuery.includes('lactic acid') || lowerQuery.includes('aha')) {
      return `🔬 AHA (Glycolic/Lactic Acid): Water-soluble exfoliants for surface renewal. Lactic acid is gentler for sensitive skin.`
    }

    if (lowerQuery.includes('peptide') || lowerQuery.includes('peptides')) {
      return `✨ Peptides: Short-chain amino acids that signal skin to produce more collagen and repair. Best used with vitamin C and retinoids.`
    }

    if (lowerQuery.includes('ceramide') || lowerQuery.includes('barrier')) {
      return `🛡️ Ceramides: Essential lipids that restore skin barrier and prevent TEWL (moisture loss). Crucial for dry and sensitive skin.`
    }

    if (lowerQuery.includes('facewash') || lowerQuery.includes('face wash') || lowerQuery.includes('cleanser')) {
      return `🧼 Facewash Guide:\n• Use twice daily (morning/night)\n• Gel for oily skin (salicylic acid)\n• Cream for dry/sensitive\n• Gently massage 30-60 seconds, rinse lukewarm\n• Follow with toner while skin is damp`
    }

    if (lowerQuery.includes('moisturizer') || lowerQuery.includes('moisturise') || lowerQuery.includes('hydrate') || lowerQuery.includes('cream')) {
      return `💧 Moisturizer hydrates and protects. Apply while skin is damp. Choose gel for oily skin, cream for dry.`
    }

    if (lowerQuery.includes('toner')) {
      return `🌺 Toner balances skin pH and preps for absorption. Hydrating for dry skin, astringent for oily. Look for alcohol-free formulas.`
    }

    if (lowerQuery.includes('serum')) {
      return `💉 Serums deliver concentrated actives. Apply after toner, before moisturizer. 2-3 drops max - gently pat, don't rub.`
    }

if (lowerQuery.includes('puffy eyes') || (lowerQuery.includes('puffy') && (lowerQuery.includes('eye') || lowerQuery.includes('eyes')))) {
      return `👁️ For Puffy Eyes:\nMorning swelling from fluid retention, salt intake, or lack of sleep.\n\nSolutions:\n• Store eye cream in fridge\n• Use caffeine-based products\n• Sleep with elevated head\n• Reduce salt intake\n• Stay well hydrated\n• Cold tea bags or ice for quick relief\n\nMedglow offers gentle eye creams suitable for all ages.`
    }

    if (lowerQuery.includes('eye cream') || lowerQuery.includes('dark circle') || lowerQuery.includes('under eye')) {
      return `👁️ Eye Cream:\nTargets delicate under-eye area. Gently pat around orbital bone (not directly on eyelids). Use morning and night for hydration and brightening.`
    }

    if (lowerQuery.includes('puffy eyes') || (lowerQuery.includes('puffy') && lowerQuery.includes('eye'))) {
      return `👁️ For Puffy Eyes:\nMorning swelling from fluid retention, salt intake, or lack of sleep.\n\nSolutions:\n• Store eye cream in fridge\n• Use caffeine-based products\n• Sleep with elevated head\n• Reduce salt intake\n• Stay well hydrated\n• Cold tea bags or ice for quick relief\n\nMedglow offers gentle eye creams suitable for all ages.`
    }

    if (lowerQuery.includes('routine order') || lowerQuery.includes('how to use skincare') || lowerQuery.includes('skincare steps') || lowerQuery.includes('apply first')) {
      return `📋 Skincare Steps (AM & PM):\n1. Cleanser\n2. Toner\n3. Serum\n4. Moisturizer\n5. Sunscreen (AM only)\n\nApply thinnest to thickest. Wait 30-60 seconds between layers.`
    }

    if (lowerQuery.includes('layer') || lowerQuery.includes('mix') || lowerQuery.includes('combine') || lowerQuery.includes('with') || lowerQuery.includes('can i use')) {
      return `⚡ Layering Rules:\nWait 30-60 seconds between actives. Don't mix retinoids with vitamin C. Introduce one new product every 2 weeks. Patch test first.`
    }

    if (lowerQuery.includes('pregnant') || lowerQuery.includes('pregnancy') || lowerQuery.includes('breastfeeding')) {
      return `🤰 Pregnancy Skincare:\nMost Medglow products are safe, but avoid retinoids and high-concentration acids. Niacinamide, vitamin C, and gentle cleansers are safe. Always consult your doctor.`
    }

    if (lowerQuery.includes('burning') || lowerQuery.includes('stinging') || lowerQuery.includes('irritation') || lowerQuery.includes('reaction') || lowerQuery.includes('allergic')) {
      return `⚠️ Product Reaction:\nMild tingling with exfoliants is normal. Burning/stinging means stop use - rinse gently, apply soothing moisturizer. Reduce frequency if needed.`
    }

    if (lowerQuery.includes('purging') || lowerQuery.includes('initial breakouts')) {
      return `🔄 Purging Explained:\nAccelerated cell turnover bringing deep clogs to surface. Lasts 2-6 weeks.\n\nIf severe, reduce active frequency. Not everyone experiences this. Keep consistent!`
    }

    if (lowerQuery.includes('cosrx') || lowerQuery.includes('cerave') || lowerQuery.includes('brand') || lowerQuery.includes('brands') || lowerQuery.includes('which brand')) {
      return `🏆 Trusted Brands at Medglow:\nWe carry internationally recognized brands including COSRX, CeraVe, and other dermatologist-recommended options. All products are 100% authentic.`
    }

    if (lowerQuery.includes('baby care') || lowerQuery.includes('baby')) {
      return `👶 Baby Care Essentials:\nWe offer curated baby-safe products for skincare, hygiene, and nutrition. Reliable choices for new parents, all pharmacy-approved.`
    }

    if (lowerQuery.includes('blood test') || lowerQuery.includes('blood testing') || lowerQuery.includes('lab test')) {
      return `🩸 On-site Blood Testing:\nFast, hygienic sample collection with clear guidance on results and follow-up care.\n\nDesigned for routine wellness checks at our Dadhikot location.`
    }

    if (lowerQuery.includes('payment') || lowerQuery.includes('esewa') || lowerQuery.includes('khalti') || lowerQuery.includes('pay') || lowerQuery.includes('wallet')) {
      return `💳 Payment Options:\n${MEDGLOW_INFO.payment.methods.join(', ')}.\n\n${MEDGLOW_INFO.payment.accepted}\n\nFor online orders via WhatsApp/Instagram, we accept all major digital wallets.`
    }

    if (lowerQuery.includes('service') || lowerQuery.includes('consultation') || lowerQuery.includes('what do you offer')) {
      return `🏥 Medglow Services:\n• ${MEDGLOW_INFO.services.prescription}\n• ${MEDGLOW_INFO.services.consultation}\n• ${MEDGLOW_INFO.services.bloodTest}\n• ${MEDGLOW_INFO.services.babyCare}\n• ${MEDGLOW_INFO.services.vitamins}\n• ${MEDGLOW_INFO.services.firstAid}\n• ${MEDGLOW_INFO.services.elderlyCare}\n\n${MEDGLOW_INFO.mission}`
    }

    if (lowerQuery.includes('cellular turnover') || lowerQuery.includes('how long') || lowerQuery.includes('see results')) {
      return `🔄 Cellular turnover takes 28-40 days on average. Expect brightening results in 6-8 weeks. Melasma may take 3-6 months for visible improvement.`
    }

    if (lowerQuery.includes('skin barrier') || lowerQuery.includes('damaged skin') || lowerQuery.includes('tewl') || lowerQuery.includes('transepidermal')) {
      return `🛡️ Skin Barrier Science:\nThe stratum corneum is your outermost protective layer. When damaged, it causes TEWL (moisture loss).\n\nMedglow products with ceramides and hyaluronic acid help restore this barrier.`
    }

    if (lowerQuery.includes('blackhead') || lowerQuery.includes('whitehead') || lowerQuery.includes('comedo')) {
      return `🎯 Blackheads/Whitheads:\n• Blackheads (open comedones): Use BHA/salicylic acid\n• Whiteheads (closed comedones): Use AHA/retinoids\n\nRegular exfoliation prevents both. Don't squeeze!`
    }

    if (lowerQuery.includes('enlarged pore') || lowerQuery.includes('pore size') || lowerQuery.includes('pores')) {
      return `🔍 Pore Size Management:\nEnlarged pores are often oily skin related. Retinoids, niacinamide, and BHA help minimize appearance.\n\nRegular cleansing and chemical exfoliation are key.`
    }

    if (lowerQuery.includes('eczema') || lowerQuery.includes('dermatitis') || lowerQuery.includes('psoriasis')) {
      return `🌿 Eczema/Dermatitis Care:\nInflammatory barrier conditions requiring moisture and careful product selection.\n\nUse fragrance-free, ceramide-rich moisturizers. Topical steroids may be needed - consult our pharmacist.`
    }

    if (lowerQuery.includes('rosacea')) {
      return `🌺 Rosacea Management:\nChronic redness and visible blood vessels. Avoid triggers (spicy food, heat, alcohol, stress).\n\nUse gentle, fragrance-free products. Cool water only.`
    }

    if (lowerQuery.includes('ingredients') || lowerQuery.includes('ingredient')) {
      return `📚 Key Skincare Ingredients at Medglow:\n\nAHAs (Glycolic/Lactic): Exfoliation\nBHA (Salicylic): Deep pore cleaning\nRetinoids: Anti-aging, acne\nVitamin C: Antioxidant, brightening\nNiacinamide: Multi-tasking care\nHyaluronic Acid: Hydration\nCeramides: Barrier repair\nPeptides: Collagen boost\nKojic Acid: Pigmentation\nAzelaic Acid: Acne + brightening\n\nAsk about any ingredient for detailed guidance!`
    }

    if (lowerQuery.includes('summer') || lowerQuery.includes('monsoon') || lowerQuery.includes('winter') || lowerQuery.includes('seasonal')) {
      return `🌦️ Seasonal Skincare:\n\nSummer: Lighter moisturizers, higher SPF, more hydration\nWinter: Rich moisturizers, barrier support, humidifier indoors\nMonsoon: Antifungal prevention, extra cleansing for humidity\n\nMedglow adjusts recommendations based on Nepal's seasons!`
    }

    if (lowerQuery.includes('sleep') || lowerQuery.includes('water') || lowerQuery.includes('diet') || lowerQuery.includes('lifestyle') || lowerQuery.includes('exercise') || lowerQuery.includes('stress')) {
      return `🌱 Lifestyle & Skin:\n• Sleep: 7-9 hours nightly for skin repair\n• Hydration: 2-3 liters water daily\n• Diet: Antioxidant-rich foods support skin\n• Stress: High cortisol worsens acne and aging\n• Exercise: Cleanse after workout to prevent clogged pores`
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('email')) {
      return `📞 Contact Information:\n• Phone/WhatsApp: ${MEDGLOW_INFO.contact.phone}\n• Email: ${MEDGLOW_INFO.contact.email}\n• Instagram: @medglow.pharmacy.skincare\n• TikTok: @medglowpharmacy.skincare\n\nResponse time: ${MEDGLOW_INFO.contact.responseTime}`
    }

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! I'm GlowMaya from MedGlow Pharmacy. How can I help you today?"
    }

    if (lowerQuery.includes('thank')) {
      return "You're welcome! Feel free to ask any other questions about skincare or our pharmacy services."
    }

    if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
      return "Thank you for chatting! Have a wonderful day and take care of your skin!"
    }

    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('how much')) {
      return `💰 Product Pricing:\nFor specific pricing, contact us via WhatsApp at ${MEDGLOW_INFO.contact.phone} or check our Instagram @medglow.pharmacy.skincare.\n\nWe offer competitive prices on all international brands!`
    }

    return "I'm here to help! Ask about location, delivery, hours, skincare routines, ingredients, skin concerns, or our services."
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const response = await getAIResponse(inputValue)
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isBot: true
    }
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    { icon: MapPin, text: 'Location & Hours' },
    { icon: Truck, text: 'Delivery Info' },
    { icon: Leaf, text: 'Daily Routine' },
    { icon: Leaf, text: 'Oily Skin Care' },
    { icon: Leaf, text: 'Melasma Help' },
    { icon: Leaf, text: 'SPF Importance' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-full shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
        aria-label="Chat with GlowMaya"
      >
        <Leaf className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-96 ${isMinimized ? 'h-16' : 'h-[580px]'} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all duration-300`}>
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">GlowMaya</h3>
                <p className="text-xs text-slate-800">MedGlow Pharmacy AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(!isMinimized)
                }}
                className="text-slate-950 hover:text-slate-700 transition p-1"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-950 hover:text-slate-700 transition p-1"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl">
                    <p className="text-sm italic">GlowMaya is typing...</p>
                  </div>
                </div>
              )}
              {messages.length <= 1 && (
                <div className="flex flex-col space-y-2">
                  <p className="text-xs text-slate-600 font-semibold">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInputValue(q.text)
                          setTimeout(() => handleSend(), 10)
                        }}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-full hover:bg-slate-100 transition font-medium"
                      >
                        <q.icon className="w-3 h-3" />
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {!isMinimized && (
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about skincare, ingredients, or our pharmacy..."
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-full focus:outline-none focus:border-amber-400 text-slate-900 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="flex items-center justify-center w-10 h-10 bg-amber-400 text-slate-950 rounded-full hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}