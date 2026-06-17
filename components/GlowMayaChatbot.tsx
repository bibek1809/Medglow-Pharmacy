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
    benzoylPeroxide: 'Antibacterial for acne. Can dry - use sparingly.'
  },
  concerns: {
    acne: ' Caused by bacteria, hormones, or occlusion. Treat with salicylic acid, niacinamide, and non-comedogenic products.',
    hyperpigmentation: 'Dark spots from inflammation or UV. Treat with vitamin C, kojic acid, and SPF.',
    melasma: 'Hormonal and sun-triggered. Requires strict SPF, vitamin C, and kojic acid.',
    aging: 'Loss of collagen, elastin, and hydration. Treat with retinoids, peptides, and sunscreen.',
    rosacea: 'Chronic redness and visible blood vessels. Avoid triggers, use gentle products.',
    eczema: 'Inflammatory barrier condition. Requires moisture and steroid treatment.'
  },
  routines: {
    am: '1. Cleanser\n2. Toner\n3. Antioxidant Serum (Vitamin C)\n4. Moisturizer\n5. Sunscreen (SPF 30+)',
    pm: '1. Cleanser\n2. Toner\n3. Treatment Serum (Retinol/Niacinamide)\n4. Eye Cream\n5. Night Cream',
    oily: 'Use gel cleanser, alcohol-free toner, niacinamide serum, lightweight gel moisturizer, oil-free SPF. Avoid heavy creams.',
    sensitive: 'Use cream cleanser, hydrating toner, ceramide serum, fragrance-free moisturizer, mineral SPF.',
    antiAging: 'Retinol or peptides at night, vitamin C in morning, sunscreen daily, hyaluronic acid for hydration.',
    brightening: 'Vitamin C or kojic acid serum, niacinamide, moisturizer, SPF 50+ in AM. Consistency is key.'
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      })
      if (response.ok) {
        const data = await response.json()
        return data.reply || getFallbackResponse(query)
      }
      return getFallbackResponse(query)
    } catch {
      return getFallbackResponse(query)
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

    if (lowerQuery.includes('map') || lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('dadhikot') || lowerQuery.includes('harsha chowk') || lowerQuery.includes('landmark')) {
      return `📍 Our Location:\n${MEDGLOW_INFO.location.address} (${MEDGLOW_INFO.location.postalCode})\n\nLandmark: ${MEDGLOW_INFO.location.landmarks}\n\nGoogle Maps: ${MEDGLOW_INFO.location.googleMaps}\nCoordinates: ${MEDGLOW_INFO.location.coordinates.lat}, ${MEDGLOW_INFO.location.coordinates.lng}`
    }

    if (lowerQuery.includes('delivery') || lowerQuery.includes('deliver') || lowerQuery.includes('shipping') || lowerQuery.includes('ship') || lowerQuery.includes('order online')) {
      return `📦 Delivery Information:\n• We deliver across ${MEDGLOW_INFO.delivery.areas}\n• Timeframe: ${MEDGLOW_INFO.delivery.timeframe}\n• Order via: ${MEDGLOW_INFO.delivery.methods.join(', ')}\n\nContact us on WhatsApp at ${MEDGLOW_INFO.contact.phone} or visit our Instagram/TikTok to place orders.`
    }

    if (lowerQuery.includes('open') || lowerQuery.includes('hour') || lowerQuery.includes('time') || lowerQuery.includes('close') || lowerQuery.includes('opening')) {
      return `🕒 Opening Hours:\nWe're open ${MEDGLOW_INFO.hours.days} from ${MEDGLOW_INFO.hours.open} to ${MEDGLOW_INFO.hours.close}.\nWalk-ins are welcome! You can also reach us via WhatsApp, Instagram, or TikTok.`
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('whatsapp')) {
      return `📞 Contact Information:\n• Phone/WhatsApp: ${MEDGLOW_INFO.contact.phone}\n• Email: ${MEDGLOW_INFO.contact.email}\n• Instagram: @medglow.pharmacy.skincare\n• TikTok: @medglowpharmacy.skincare\n\nSend us a message anytime for skincare advice or product inquiries!`
    }

    if (lowerQuery.includes('what is my skin care routine') || lowerQuery.includes('what should be daily routine') || lowerQuery.includes('daily skincare')) {
      return `🌅 Your Daily Skincare Routine:\n\nMorning (AM):\n${SKINCARE_KNOWLEDGE.routines.am}\n\nEvening (PM):\n${SKINCARE_KNOWLEDGE.routines.pm}`
    }

    if (lowerQuery.includes('oily face') || lowerQuery.includes('oily skin') || lowerQuery.includes('acne prone') || lowerQuery.includes('oily')) {
      return `🧼 For Oily/Acne-Prone Skin:\n${SKINCARE_KNOWLEDGE.routines.oily}`
    }

    if (lowerQuery.includes('sensitive skin')) {
      return `🌸 For Sensitive Skin:\n${SKINCARE_KNOWLEDGE.routines.sensitive}`
    }

    if (lowerQuery.includes('skin barrier') || lowerQuery.includes('damaged skin') || lowerQuery.includes('stratum corneum')) {
      return `🛡️ Skin Barrier Science:\nThe stratum corneum is your outermost protective layer. When damaged, it shows as redness, flaking, or stinging. This leads to TEWL (moisture loss). Medglow products with ceramides and hyaluronic acid help restore this barrier.`
    }

    if (lowerQuery.includes('tewl') || lowerQuery.includes('transepidermal water loss')) {
      return `💧 TEWL (Transepidermal Water Loss) occurs when your skin barrier is compromised, causing moisture to escape. Prevent it with moisturizers containing ceramides, shea butter, and hyaluronic acid.`
    }

    if (lowerQuery.includes('cellular turnover') || lowerQuery.includes('how long') || lowerQuery.includes('see results')) {
      return `🔄 Cellular turnover takes 28-40 days. Expect brightening results in 6-8 weeks. Melasma may take 3-6 months for visible improvement with consistent care.`
    }

    if (lowerQuery.includes('sunscreen') || lowerQuery.includes('spf') || lowerQuery.includes('sun block') || lowerQuery.includes('why sunscreen')) {
      return `☀️ SPF is critical! UV rays trigger melanin production (dark spots) and degrade skincare actives. Apply SPF 30+ daily, even indoors. Reapply every 2 hours outdoors.`
    }

    if (lowerQuery.includes('glycolic acid')) {
      return `🔬 Glycolic Acid: An AHA exfoliant that dissolves dead skin bonds. Start with 5%, use 2-3 times weekly. It improves texture and brightness but avoid if skin is sensitive or compromised.`
    }

    if (lowerQuery.includes('kojic acid') || lowerQuery.includes('koijc')) {
      return `🍊 Kojic Acid inhibits tyrosinase (melanin enzyme). Excellent for hyperpigmentation and melasma. May cause initial purging - be consistent for 4-6 weeks to see results.`
    }

    if (lowerQuery.includes('niacinamide')) {
      return `✨ Niacinamide (Vitamin B3) regulates oil, strengthens barrier, reduces inflammation, and improves skin tone. Works with Vitamin C - use Vitamin C in morning, niacinamide at night.`
    }

    if (lowerQuery.includes('retinoid') || lowerQuery.includes('retinol')) {
      return `🌙 Retinoids (Vitamin A) boost cell turnover, collagen, and treat acne/aging. Start low frequency (2-3x weekly), increase gradually. Never use with benzoyl peroxide.`
    }

    if (lowerQuery.includes('vitamin c')) {
      return `🍋 Vitamin C is a potent antioxidant protecting from free radicals. Use in morning under sunscreen. Brightens, firms, and supports collagen production.`
    }

    if (lowerQuery.includes('hyaluronic acid')) {
      return `💦 Hyaluronic Acid holds 1000x its weight in water. Apply to damp skin for best hydration. Works for all skin types, even oily!`
    }

    if (lowerQuery.includes('melasma') || lowerQuery.includes('hyperpigmentation')) {
      return `🎨 Melasma/Hyperpigmentation Treatment:\n${SKINCARE_KNOWLEDGE.routines.brightening}\n\nBoth require strict SPF 50+ to prevent worsening. Hormonal triggers should also be managed.`
    }

    if (lowerQuery.includes('acne') || lowerQuery.includes('pimple') || lowerQuery.includes('breakout')) {
      return `🎯 Acne Management:\nCaused by bacteria, hormones, or occlusion. Treatment: salicylic acid cleanser, niacinamide serum, oil-free moisturizer, and SPF. Consider oral consultation for severe cases.`
    }

    if (lowerQuery.includes('facewash') || lowerQuery.includes('face wash') || lowerQuery.includes('cleanser')) {
      return `🧼 Facewash Guide:\n• Use twice daily (morning/night)\n• Gel for oily skin (salicylic acid)\n• Cream for dry/sensitive\n• Gently massage 30-60 seconds, rinse lukewarm\n• Follow with toner while skin is damp`
    }

    if (lowerQuery.includes('moisturizer') || lowerQuery.includes('moisturise') || lowerQuery.includes('hydrate')) {
      return `💧 Moisturizer Application:\nApply to damp skin to lock in hydration. Choose gel for oily skin, cream for dry. Contains humectants (hyaluronic acid) and occlusives (ceramides).`
    }

    if (lowerQuery.includes('toner')) {
      return `🌺 Toner Purpose:\nBalances skin pH after cleansing and prepares skin for better absorption. Apply with palms or cotton. Hydrating for dry skin, astringent for oily.`
    }

    if (lowerQuery.includes('serum')) {
      return `💉 Serum Power:\nConcentrated actives for targeted concerns. Apply after toner, before moisturizer. 2-3 drops max - gently pat, don't rub.`
    }

    if (lowerQuery.includes('eye cream') || lowerQuery.includes('dark circle') || lowerQuery.includes('puffy eyes')) {
      return `👁️ Eye Cream:\nTargets delicate under-eye area. Gently pat around orbital bone (not directly on eyelids). Use morning and night for hydration and brightening.`
    }

    if (lowerQuery.includes('pregnant') || lowerQuery.includes('pregnancy') || lowerQuery.includes('breastfeeding')) {
      return `🤰 Pregnancy Skincare:\nMost Medglow products are safe, but avoid retinoids and high-concentration acids. Consult your doctor. Niacinamide, vitamin C, and gentle cleansers are safe.`
    }

    if (lowerQuery.includes('burning') || lowerQuery.includes('stinging') || lowerQuery.includes('irritation') || lowerQuery.includes('reaction')) {
      return `⚠️ Product Reaction:\nMild tingling with exfoliants is normal. Burning/stinging means stop use - rinse gently, apply soothing moisturizer. Reduce frequency if needed.`
    }

    if (lowerQuery.includes('purging') || lowerQuery.includes('breakouts')) {
      return `🔄 Purging Explained:\nAccelerated cell turnover bringing deep clogs to surface. Lasts 2-6 weeks. If severe, reduce active frequency. Not everyone experiences this.`
    }

    if (lowerQuery.includes('routine order') || lowerQuery.includes('apply first')) {
      return `📋 Correct Routine Order:\nCleanser → Toner → Serum → Moisturizer → Sunscreen (AM)\nThinnest to thickest texture. Wait 30-60 seconds between layers.`
    }

    if (lowerQuery.includes('layer') || lowerQuery.includes('mix') || lowerQuery.includes('combine')) {
      return `⚡ Layering Rules:\nWait 30-60 seconds between actives. Don't mix retinoids with vitamin C. Introduce one new product every 2 weeks. Patch test first.`
    }

    if (lowerQuery.includes('cosrx') || lowerQuery.includes('cera ve') || lowerQuery.includes('brand')) {
      return `🏆 Trusted Brands at Medglow:\nWe carry COSRX, CeraVe, and other dermatologist-recommended brands. All products are authentic and selected for safety and efficacy.`
    }

    if (lowerQuery.includes('baby care') || lowerQuery.includes('baby')) {
      return `👶 Baby Care Essentials:\nWe offer curated baby-safe products for skin, hygiene, and nutrition. Reliable choices for new parents and growing families, all pharmacy-approved.`
    }

    if (lowerQuery.includes('blood test')) {
      return `🩸 On-site Blood Testing:\nFast, hygienic sample collection with clear guidance on results and follow-up care. Designed for routine wellness checks at our Dadhikot location.`
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

    return "I'm here to help! You can ask about our location, delivery, opening hours, skincare routines, ingredients, skin concerns, or our services. What would you like to know?"
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
        onClick={() => setIsOpen(true)}
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
                onClick={() => setIsMinimized(!isMinimized)}
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