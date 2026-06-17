import { NextRequest } from 'next/server'

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

function getSmartResponse(query: string): string | null {
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

  if (lowerQuery.includes('routine') || lowerQuery.includes('daily skincare') || lowerQuery.includes('what is my skin care routine') || lowerQuery.includes('what should be daily routine') || lowerQuery.includes('morning routine') || lowerQuery.includes('night routine') || lowerQuery.includes('pm routine')) {
    return `🌅 Your Daily Skincare Routine:\n\nMorning (AM):\n${SKINCARE_KNOWLEDGE.routines.am}\n\nEvening (PM):\n${SKINCARE_KNOWLEDGE.routines.pm}`
  }

  if (lowerQuery.includes('oily face') || lowerQuery.includes('oily skin') || lowerQuery.includes('acne prone') || lowerQuery.includes('oily') || lowerQuery.includes('acne')) {
    return `🧼 For Oily/Acne-Prone Skin:\n${SKINCARE_KNOWLEDGE.routines.oily}\n\nAcne is caused by bacteria, hormones, or occlusion. Use salicylic acid, niacinamide, and non-comedogenic products. For severe cases, consult our pharmacist.`
  }

  if (lowerQuery.includes('sensitive skin') || lowerQuery.includes('redness') || lowerQuery.includes('irritated')) {
    return `🌸 For Sensitive Skin:\n${SKINCARE_KNOWLEDGE.routines.sensitive}\n\nChoose fragrance-free, minimal ingredient formulas. Always patch test new products.`
  }

  if (lowerQuery.includes('dry skin') || lowerQuery.includes('dehydrated') || lowerQuery.includes('flaky')) {
    return `💧 For Dry/Dehydrated Skin:\n${SKINCARE_KNOWLEDGE.routines.dry}\n\nApply moisturizers to damp skin. Look for hyaluronic acid and ceramides.`
  }

  if (lowerQuery.includes('melasma') || lowerQuery.includes('hyperpigmentation') || lowerQuery.includes('dark spot') || lowerQuery.includes('dark spots') || lowerQuery.includes('pigmentation')) {
    return `🎨 Melasma/Hyperpigmentation Treatment:\n${SKINCARE_KNOWLEDGE.routines.brightening}\n\nBoth require strict SPF 50+ to prevent worsening. Hormonal triggers should also be managed.`
  }

  if (lowerQuery.includes('anti aging') || lowerQuery.includes('wrinkle') || lowerQuery.includes('fine line') || lowerQuery.includes('aging')) {
    return `🌙 Anti-Aging Routine:\n${SKINCARE_KNOWLEDGE.routines.antiAging}\n\nStart early! Prevention is easier than correction. Consistent use shows results in 6-8 weeks.`
  }

  if (lowerQuery.includes('sunscreen') || lowerQuery.includes('spf') || lowerQuery.includes('sun block') || lowerQuery.includes('sunblock') || lowerQuery.includes('why sunscreen')) {
    return `☀️ SPF is critical! UV rays trigger melanin production (dark spots) and degrade skincare actives. Apply SPF 30+ daily, even indoors. Reapply every 2 hours outdoors.\n\nMedglow carries broad-spectrum sunscreens suitable for all skin types.`
  }

  if (lowerQuery.includes('glycolic acid')) {
    return `🔬 Glycolic Acid: An AHA exfoliant that dissolves dead skin bonds. Start with 5%, use 2-3 times weekly. Improves texture and brightness, but avoid if skin is sensitive or compromised.`
  }

  if (lowerQuery.includes('kojic acid') || lowerQuery.includes('koijc') || lowerQuery.includes('arbutin') || lowerQuery.includes('alpha arbutin')) {
    return `🍊 Kojic Acid inhibits tyrosinase (melanin enzyme). Great for hyperpigmentation and melasma.\n\nMay cause initial purging - be consistent for 4-6 weeks to see results.\nAlpha arbutin is a gentler alternative with similar brightening effects.`
  }

  if (lowerQuery.includes('niacinamide')) {
    return `✨ Niacinamide (Vitamin B3) regulates oil, strengthens barrier, reduces inflammation, and improves skin tone. Works with Vitamin C - use Vitamin C in morning, niacinamide at night.\n\nAvailable at Medglow in various percentages. Start with 5% if new to it.`
  }

  if (lowerQuery.includes('retinoid') || lowerQuery.includes('retinol') || lowerQuery.includes('retinaldehyde')) {
    return `🌙 Retinoids (Vitamin A) boost cell turnover, collagen, and treat acne/aging. Start low frequency (2-3x weekly), increase gradually.\n\nNever use with benzoyl peroxide. Always use SPF the next day. Medglow offers various strengths.`
  }

  if (lowerQuery.includes('vitamin c')) {
    return `🍋 Vitamin C is a potent antioxidant protecting from free radicals. Use in morning under sunscreen. Brightens, firms, and supports collagen production.\n\nMedglow stocks stable vitamin C serums. Apply to clean, dry skin before moisturizer.`
  }

  if (lowerQuery.includes('hyaluronic acid')) {
    return `💦 Hyaluronic Acid holds 1000x its weight in water. Provides hydration at all skin depths.\n\nApply to damp skin, then seal with moisturizer. Works for ALL skin types, even oily!`
  }

  if (lowerQuery.includes('salicylic acid') || lowerQuery.includes('bha') || lowerQuery.includes('benzoyl peroxide') || lowerQuery.includes('bp')) {
    return `🎯 BHA/Salicylic Acid: Oil-soluble exfoliant that penetrates pores. Perfect for acne, blackheads, and oily skin.\n\nUse 1-3x weekly, gradually increase. Combine with niacinamide for best results.\n\nBenzoyl Peroxide: Antibacterial for acne. Can dry - use sparingly (2.5-5%).`
  }

  if (lowerQuery.includes('lactic acid') || lowerQuery.includes('aha')) {
    return `🔬 AHA (Glycolic/Lactic Acid): Water-soluble exfoliants for surface renewal.\n\nLactic acid is gentler for sensitive skin. Use PM, start 2-3x weekly.`
  }

  if (lowerQuery.includes('peptide') || lowerQuery.includes('peptides')) {
    return `✨ Peptides: Short-chain amino acids that signal skin to produce more collagen and repair.\n\nBest used with vitamin C and retinoids. Apply after cleanser, before moisturizer.`
  }

  if (lowerQuery.includes('ceramide') || lowerQuery.includes('barrier')) {
    return `🛡️ Ceramides: Essential lipids that restore skin barrier and prevent TEWL (moisture loss).\n\nCrucial for dry, sensitive, and compromised skin. Use in moisturizers and barrier creams.`
  }

  if (lowerQuery.includes('facewash') || lowerQuery.includes('face wash') || lowerQuery.includes('cleanser') || lowerQuery.includes('cleanse')) {
    return `🧼 Facewash Guide:\n• Use twice daily (morning/night)\n• Gel for oily skin (salicylic acid)\n• Cream for dry/sensitive\n• Gently massage 30-60 seconds, rinse lukewarm\n• Follow with toner while skin is damp\n\nMedglow carries dermatologist-recommended cleansers for all skin types.`
  }

  if (lowerQuery.includes('moisturizer') || lowerQuery.includes('moisturise') || lowerQuery.includes('hydrate') || lowerQuery.includes('cream')) {
    return `💧 Moisturizer Application:\nApply to damp skin to lock in hydration. Choose gel for oily skin, cream for dry.\n\nContains humectants (hyaluronic acid) and occlusives (ceramides). Weight of your moisturizer should match your skin needs.`
  }

  if (lowerQuery.includes('toner')) {
    return `🌺 Toner Purpose:\nBalances skin pH after cleansing and prepares skin for better absorption. Apply with palms or cotton.\n\nHydrating for dry skin, astringent for oily. Look for alcohol-free formulas at Medglow.`
  }

  if (lowerQuery.includes('serum')) {
    return `💉 Serum Power:\nConcentrated actives for targeted concerns. Apply after toner, before moisturizer. 2-3 drops max - gently pat, don't rub.\n\nSerums contain the highest ingredient concentration in your routine.`
  }

  if (lowerQuery.includes('eye cream') || lowerQuery.includes('dark circle') || lowerQuery.includes('puffy eyes') || lowerQuery.includes('puffy')) {
    return `👁️ Eye Cream:\nTargets delicate under-eye area. Gently pat around orbital bone (not directly on eyelids). Use morning and night for hydration and brightening.\n\nFor puffy eyes: Store in fridge, use caffeine-based products, sleep elevated, reduce salt intake, and stay hydrated. Cold tea bags or ice also help reduce morning puffiness.\n\nMedglow offers gentle eye creams suitable for all ages.`
  }

  if (lowerQuery.includes('routine order') || lowerQuery.includes('how to use skincare') || lowerQuery.includes('skincare steps') || lowerQuery.includes('apply first') || lowerQuery.includes('layer')) {
    return `📋 Skincare Steps (AM & PM):\n1. Cleanser\n2. Toner\n3. Serum\n4. Moisturizer\n5. Sunscreen (AM only)\n\nApply thinnest to thickest consistency. Wait 30-60 seconds between layers.\n\nAM: Antioxidant focus (Vitamin C)\nPM: Repair focus (Retinoids)`
  }

  if (lowerQuery.includes('mix') || lowerQuery.includes('combine') || lowerQuery.includes('with') || lowerQuery.includes('can i use')) {
    return `⚡ Layering Rules:\n• Wait 30-60 seconds between actives\n• Don't mix retinoids with vitamin C\n• Don't mix AHA/BHA with retinoids same session\n• Introduce one new product every 2 weeks\n• Always patch test first\n\nWhen in doubt, ask GlowMaya or our pharmacist!`
  }

  if (lowerQuery.includes('pregnant') || lowerQuery.includes('pregnancy') || lowerQuery.includes('breastfeeding') || lowerQuery.includes('maternity')) {
    return `🤰 Pregnancy Skincare:\nMost Medglow products are safe, but avoid retinoids and high-concentration acids during pregnancy.\n\nSafe ingredients: Niacinamide, vitamin C, gentle cleansers, mineral SPF.\n\nAlways consult your doctor before starting new skincare during pregnancy.`
  }

  if (lowerQuery.includes('burning') || lowerQuery.includes('stinging') || lowerQuery.includes('irritation') || lowerQuery.includes('reaction') || lowerQuery.includes('allergic')) {
    return `⚠️ Product Reaction:\nMild tingling with exfoliants is normal. Burning/stinging means stop use - rinse gently, apply soothing moisturizer.\n\nReduce frequency if needed. Discontinue use if severe reactions occur.\n\nMedglow pharmacists can help identify problematic ingredients.`
  }

  if (lowerQuery.includes('purging') || lowerQuery.includes('initial breakouts') || lowerQuery.includes('worsening acne')) {
    return `🔄 Purging Explained:\nAccelerated cell turnover bringing deep clogs to surface. Lasts 2-6 weeks.\n\nIf severe, reduce active frequency. Not everyone experiences this. Keep consistent for best results.`
  }

  if (lowerQuery.includes('cosrx') || lowerQuery.includes('cera ve') || lowerQuery.includes('brand') || lowerQuery.includes('brands') || lowerQuery.includes('which brand')) {
    return `🏆 Trusted Brands at Medglow:\nWe carry internationally recognized brands including COSRX, CeraVe, and other dermatologist-recommended options.\n\nAll products are 100% authentic and carefully selected for safety, efficacy, and suitability for Nepali climate.`
  }

  if (lowerQuery.includes('baby care') || lowerQuery.includes('baby')) {
    return `👶 Baby Care Essentials:\nWe offer curated baby-safe products for skincare, hygiene, and nutrition.\n\nReliable choices for new parents and growing families, all pharmacy-approved. From gentle cleansers to vitamin supplements, Medglow has you covered.`
  }

  if (lowerQuery.includes('blood test') || lowerQuery.includes('blood testing') || lowerQuery.includes('lab test')) {
    return `🩸 On-site Blood Testing:\nFast, hygienic sample collection with clear guidance on results and follow-up care.\n\nDesigned for routine wellness checks at our Dadhikot location.\n\nContact us for test packages and pricing - walk-ins welcome during pharmacy hours.`
  }

  if (lowerQuery.includes('payment') || lowerQuery.includes('esewa') || lowerQuery.includes('khalti') || lowerQuery.includes('pay') || lowerQuery.includes('wallet')) {
    return `💳 Payment Options:\n${MEDGLOW_INFO.payment.methods.join(', ')}\n\n${MEDGLOW_INFO.payment.accepted}\n\nFor online orders via WhatsApp/Instagram, we accept all major digital wallets.`
  }

  if (lowerQuery.includes('service') || lowerQuery.includes('consultation') || lowerQuery.includes('what do you offer')) {
    return `🏥 Medglow Services:\n• ${MEDGLOW_INFO.services.prescription}\n• ${MEDGLOW_INFO.services.consultation}\n• ${MEDGLOW_INFO.services.bloodTest}\n• ${MEDGLOW_INFO.services.babyCare}\n• ${MEDGLOW_INFO.services.vitamins}\n• ${MEDGLOW_INFO.services.firstAid}\n• ${MEDGLOW_INFO.services.elderlyCare}\n\n${MEDGLOW_INFO.mission}`
  }

  if (lowerQuery.includes('cellular turnover') || lowerQuery.includes('how long') || lowerQuery.includes('see results') || lowerQuery.includes('when will i see results')) {
    return `🔄 Cellular turnover takes 28-40 days on average. Expect brightening results in 6-8 weeks. Melasma may take 3-6 months for visible improvement with consistent care.\n\nConsistency is more important than frequency. Stick to your routine!`
  }

  if (lowerQuery.includes('skin barrier') || lowerQuery.includes('damaged skin') || lowerQuery.includes('stratum corneum') || lowerQuery.includes('tewl') || lowerQuery.includes('transepidermal')) {
    return `🛡️ Skin Barrier Science:\nThe stratum corneum is your outermost protective layer. When damaged, it shows as redness, flaking, or stinging. This leads to TEWL (moisture loss).\n\nMedglow products with ceramides and hyaluronic acid help restore this barrier effectively.`
  }

  if (lowerQuery.includes('blackhead') || lowerQuery.includes('whitehead') || lowerQuery.includes('comedo')) {
    return `🎯 Blackheads/Whitheads:\n• Blackheads (open comedones): Use BHA/salicylic acid\n• Whiteheads (closed comedones): Use AHA/retinoids\n\nRegular exfoliation prevents both. Don't squeeze - it causes scarring!`
  }

  if (lowerQuery.includes('enlarged pore') || lowerQuery.includes('pore size') || lowerQuery.includes('pores')) {
    return `🔍 Pore Size Management:\nEnlarged pores are often oily skin related. Retinoids, niacinamide, and BHA help minimize appearance.\n\nRegular cleansing and chemical exfoliation are key. Physical scrubs can stretch pores!`
  }

  if (lowerQuery.includes('eczema') || lowerQuery.includes('dermatitis') || lowerQuery.includes('psoriasis')) {
    return `🌿 Eczema/Dermatitis Care:\nInflammatory barrier conditions requiring moisture and careful product selection.\n\nUse fragrance-free, ceramide-rich moisturizers. Topical steroids may be needed - consult our pharmacist.`
  }

  if (lowerQuery.includes('rosacea')) {
    return `🌺 Rosacea Management:\nChronic redness and visible blood vessels. Identify and avoid triggers (spicy food, heat, alcohol, stress).\n\nUse gentle, fragrance-free products. Cool water only. Green-tinted SPF helps with redness.`
  }

  if (lowerQuery.includes('ingredients') || lowerQuery.includes('ingredient')) {
    return `📚 Key Skincare Ingredients at Medglow:\n\nAHAs (Glycolic/Lactic): Exfoliation\nBHA (Salicylic): Deep pore cleaning\nRetinoids: Anti-aging, acne\nVitamin C: Antioxidant, brightening\nNiacinamide: Multi-tasking care\nHyaluronic Acid: Hydration\nCeramides: Barrier repair\nPeptides: Collagen boost\nKojic Acid: Pigmentation\nAzelaic Acid: Acne + brightening\n\nAsk about any ingredient for detailed guidance!`
  }

  if (lowerQuery.includes('summer') || lowerQuery.includes('monsoon') || lowerQuery.includes('winter') || lowerQuery.includes('seasonal')) {
    return `🌦️ Seasonal Skincare:\n\nSummer: Lighter moisturizers, higher SPF, more hydration, oil-control products.\nWinter: Rich moisturizers, barrier support, humidifier indoors.\nMonsoon: Antifungal prevention, extra cleansing for humidity.\n\nMedglow adjusts recommendations based on Nepal's seasons. Ask for seasonal tips!`
  }

  if (lowerQuery.includes('sleep') || lowerQuery.includes('water') || lowerQuery.includes('diet') || lowerQuery.includes('lifestyle') || lowerQuery.includes('exercise') || lowerQuery.includes('stress')) {
    return `🌱 Lifestyle & Skin:\n• Sleep: 7-9 hours nightly for skin repair\n• Hydration: 2-3 liters water daily\n• Diet: Antioxidant-rich foods (berries, greens) support skin\n• Stress: High cortisol worsens acne and aging\n• Exercise: Sweating cleans pores - cleanse after workout\n\nYour skincare works better with healthy habits!`
  }

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return "Hello! I'm GlowMaya from MedGlow Pharmacy. I'm here to help with skincare questions, product guidance, and information about our services. What would you like to know?"
  }

  if (lowerQuery.includes('thank')) {
    return "You're welcome! I'm happy to help. Feel free to ask if you have any other questions about skincare or our pharmacy services."
  }

  if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
    return "Thank you for chatting with me! Have a wonderful day. Remember to take care of your skin!"
  }

  if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('how much')) {
    return `💰 Product Pricing:\nFor specific pricing, please contact us via WhatsApp at ${MEDGLOW_INFO.contact.phone} or check our Instagram @medglow.pharmacy.skincare.\n\nWe offer competitive prices on all international brands. Bulk orders may qualify for discounts!`
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('email')) {
    return `📞 Contact Information:\n• Phone/WhatsApp: ${MEDGLOW_INFO.contact.phone}\n• Email: ${MEDGLOW_INFO.contact.email}\n• Instagram: @medglow.pharmacy.skincare\n• TikTok: @medglowpharmacy.skincare\n\nResponse time: ${MEDGLOW_INFO.contact.responseTime}. Send us a message anytime for skincare advice or product inquiries!`
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