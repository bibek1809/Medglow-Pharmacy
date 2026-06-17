'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Leaf } from 'lucide-react'

type Message = {
  id: string
  text: string
  isBot: boolean
}

const MEDGLOW_KNOWLEDGE = {
  location: 'Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal (44800)',
  openingHours: '8:00 AM - 8:00 PM (Monday through Sunday)',
  contact: '+977 9763259854',
  delivery: '1-3 business days via partner services across Nepal',
  parking: 'Street parking available near Harsha Chowk. Look for our pharmacy sign near the main intersection.',

  skincareBasics: {
    whyRoutine: 'A skincare routine is essential because your skin naturally produces oil, sweat, and sheds dead cells daily. Without proper cleansing and protection, pores become clogged, moisture barrier weakens, and signs of aging accelerate. Water alone cannot remove impurities that daily skincare products can.',
    skinBarrier: 'A damaged skin barrier shows as redness, flaking, tightness, or stinging. The stratum corneum (outermost skin layer) acts as your skin\'s shield. Medglow products with ceramides and hyaluronic acid help repair this barrier by restoring lipids and hydration.',
    tewl: 'TEWL (Transepidermal Water Loss) is moisture escaping through damaged skin. Prevent it with moisturizers containing occlusives like shea butter or petrolatum, and humectants like hyaluronic acid.',
    cellularTurnover: 'Skin cells renew every 28-40 days. Expect to see brightening results in 6-8 weeks with consistent use, while deeper concerns like melasma may take 3-6 months.',
    sunscreenImportance: 'UV rays trigger melanin production, causing dark spots. Daily SPF prevents this cycle and protects active ingredients from degrading.',
  },

  ingredients: {
    glycolicAcid: 'Glycolic acid is an AHA exfoliant that dissolves dead skin bonds. Start with 5% concentration, use 2-3 times weekly to avoid irritation.',
    kojicAcid: 'Kojic acid inhibits tyrosinase (melanin-producing enzyme). It\'s effective for hyperpigmentation but may cause purging in first 2-4 weeks.',
    niacinamide: 'Niacinamide regulates oil, strengthens barrier, and reduces inflammation. It pairs well with Vitamin C - use Vitamin C in AM, niacinamide in PM.',
    tyrosinaseInhibitor: 'Tyrosinase converts tyrosine to melanin. Inhibiting it reduces dark spots. Found in kojic acid, vitamin C, and arbutin.',
  },

  routines: {
    oilySkin: 'For oily skin: 1) Gel cleanser (salicylic acid) 2) Alcohol-free toner 3) Niacinamide serum 4) Lightweight gel moisturizer 5) Oil-free SPF. Avoid heavy creams that can clog pores.',
    sensitiveSkin: 'For sensitive skin: 1) Gentle cream cleanser 2) Hydrating toner (no alcohol) 3) Centella asiatica or ceramide serum 4) Fragrance-free moisturizer 5) Mineral SPF (zinc oxide). Introduce actives slowly.',
    melasma: 'Melasma routine: 1) Gentle cleanser 2) Hydrating toner 3) Vitamin C or kojic acid serum 4) Brightening moisturizer 5) SPF 50+ daily. Consistency is key - results take 3-6 months.',
    am: 'Morning routine: 1) Cleanser 2) Toner 3) Serum 4) Moisturizer 5) Sunscreen (essential)',
    pm: 'Evening routine: 1) Cleanser 2) Toner 3) Treatment serum 4) Eye cream 5) Rich moisturizer for overnight repair',
  },

  safety: {
    pregnancy: 'Most Medglow products are safe during pregnancy, but avoid retinoids and high-concentration acids. Consult your doctor for precaution.',
    irritation: 'Mild tingling is normal with exfoliants. Burning/stinging means stop use - rinse gently and apply soothing moisturizer.',
    purging: 'Purging occurs when accelerated cell turnover brings deep clogs to surface. Lasts 2-6 weeks. If severe, reduce frequency.',
    prescription: 'Our advanced creams are over-the-counter. Prescription items require consultation with our pharmacist on-site.',
  }
}

export default function GlowMayaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm GlowMaya, your skincare assistant from MedGlow Pharmacy. How can I help you today?",
      isBot: true
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim()

    if (lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('dadhikot') || lowerQuery.includes('harsha chowk')) {
      return `We're located at ${MEDGLOW_KNOWLEDGE.location}. We're open daily from ${MEDGLOW_KNOWLEDGE.openingHours}. Street parking is available near Harsha Chowk.`
    }

    if (lowerQuery.includes('delivery') || lowerQuery.includes('deliver') || lowerQuery.includes('shipping') || lowerQuery.includes('ship') || lowerQuery.includes('order online')) {
      return `Yes, you can order via WhatsApp (+977 9763259854), Instagram, or TikTok. We deliver across Nepal within ${MEDGLOW_KNOWLEDGE.delivery}.`
    }

    if (lowerQuery.includes('open') || lowerQuery.includes('hour') || lowerQuery.includes('time') || lowerQuery.includes('close') || lowerQuery.includes('opening')) {
      return `We're open daily from ${MEDGLOW_KNOWLEDGE.openingHours}. Walk-ins are welcome at our Dadhikot location.`
    }

    if (lowerQuery.includes('parking') || lowerQuery.includes('landmark')) {
      return MEDGLOW_KNOWLEDGE.parking
    }

    if (lowerQuery.includes('prescription') || lowerQuery.includes('over the counter') || lowerQuery.includes('otc')) {
      return MEDGLOW_KNOWLEDGE.safety.prescription
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('whatsapp')) {
      return `Reach us at ${MEDGLOW_KNOWLEDGE.contact} via WhatsApp, or @medglow.pharmacy.skincare on Instagram and TikTok.`
    }

    if (lowerQuery.includes('routine') || lowerQuery.includes('daily skincare') || lowerQuery.includes('skincare steps') || lowerQuery.includes('how to use') || lowerQuery.includes('what is my skin care routine') || lowerQuery.includes('what should be daily routine')) {
      return `Daily skincare routine:\n${MEDGLOW_KNOWLEDGE.routines.am}\n\nEvening:\n${MEDGLOW_KNOWLEDGE.routines.pm}`
    }

    if (lowerQuery.includes('oily face') || lowerQuery.includes('oily skin') || lowerQuery.includes('acne prone') || lowerQuery.includes('oily')) {
      return MEDGLOW_KNOWLEDGE.routines.oilySkin
    }

    if (lowerQuery.includes('why skincare') || lowerQuery.includes('why do i need') || lowerQuery.includes('water enough')) {
      return MEDGLOW_KNOWLEDGE.skincareBasics.whyRoutine
    }

    if (lowerQuery.includes('skin barrier') || lowerQuery.includes('damaged skin') || lowerQuery.includes('stratum corneum')) {
      return MEDGLOW_KNOWLEDGE.skincareBasics.skinBarrier
    }

    if (lowerQuery.includes('tewl') || lowerQuery.includes('transepidermal water loss')) {
      return MEDGLOW_KNOWLEDGE.skincareBasics.tewl
    }

    if (lowerQuery.includes('cellular turnover') || lowerQuery.includes('how long') || lowerQuery.includes('see results')) {
      return MEDGLOW_KNOWLEDGE.skincareBasics.cellularTurnover
    }

    if (lowerQuery.includes('sunscreen') || lowerQuery.includes('spf') || lowerQuery.includes('sun block') || lowerQuery.includes('why sunscreen') || lowerQuery.includes('dark spot cream')) {
      return MEDGLOW_KNOWLEDGE.skincareBasics.sunscreenImportance
    }

    if (lowerQuery.includes('glycolic acid')) {
      return MEDGLOW_KNOWLEDGE.ingredients.glycolicAcid
    }

    if (lowerQuery.includes('kojic acid') || lowerQuery.includes('koijc')) {
      return MEDGLOW_KNOWLEDGE.ingredients.kojicAcid
    }

    if (lowerQuery.includes('niacinamide') || lowerQuery.includes('vitamin c') || lowerQuery.includes('vitamin')) {
      if (lowerQuery.includes('niacinamide')) return MEDGLOW_KNOWLEDGE.ingredients.niacinamide
      return 'Niacinamide pairs excellently with Vitamin C - use Vitamin C in your morning routine for antioxidant protection, and niacinamide in the evening for barrier repair.'
    }

    if (lowerQuery.includes('hyperpigmentation') || lowerQuery.includes('dark spot') || lowerQuery.includes('acne scar') || lowerQuery.includes('pigmentation')) {
      if (lowerQuery.includes('melasma')) {
        return MEDGLOW_KNOWLEDGE.routines.melasma
      }
      return 'For dark spots and hyperpigmentation: Use vitamin C or kojic acid serums, combined with niacinamide. Always pair with SPF 50+ to prevent further darkening. Results typically appear in 6-8 weeks.'
    }

    if (lowerQuery.includes('facewash') || lowerQuery.includes('face wash') || lowerQuery.includes('cleanser') || lowerQuery.includes('cleanse')) {
      return 'Use a gentle cleanser twice daily. For oily skin: gel or foam with salicylic acid. For dry/sensitive: cream-based. Gently massage for 30-60 seconds, rinse lukewarm.'
    }

    if (lowerQuery.includes('moisturizer') || lowerQuery.includes('moisturise') || lowerQuery.includes('hydrate')) {
      return 'Moisturizer hydrates and protects. Apply while skin is damp to lock in moisture. Choose gel for oily skin, cream for dry skin.'
    }

    if (lowerQuery.includes('toner') || lowerQuery.includes('tone')) {
      return 'Toner balances skin pH and preps for absorption. Use after cleansing: apply with palms or cotton. Choose hydrating or astringent based on your skin type.'
    }

    if (lowerQuery.includes('serum')) {
      return 'Serums deliver concentrated actives. Apply after toner, before moisturizer. 2-3 drops are enough - gently pat, don\'t rub.'
    }

    if (lowerQuery.includes('eye cream') || lowerQuery.includes('dark circle') || lowerQuery.includes('puffy eyes')) {
      return 'Eye cream targets delicate under-eye area. Gently pat around orbital bone - don\'t rub. Use morning and night for hydration and brightening.'
    }

    if (lowerQuery.includes('sunblock') || lowerQuery.includes('sunscreen') || lowerQuery.includes('spf') || lowerQuery.includes('sun block')) {
      return 'SPF 30+ is essential daily - even indoors. Apply as the final step in your morning routine. Reapply every 2 hours outdoors.'
    }

    if (lowerQuery.includes('pregnant') || lowerQuery.includes('pregnancy') || lowerQuery.includes('breastfeeding')) {
      return MEDGLOW_KNOWLEDGE.safety.pregnancy
    }

    if (lowerQuery.includes('burning') || lowerQuery.includes('stinging') || lowerQuery.includes('irritation') || lowerQuery.includes('reaction')) {
      return MEDGLOW_KNOWLEDGE.safety.irritation
    }

    if (lowerQuery.includes('purging') || lowerQuery.includes('breakouts')) {
      return MEDGLOW_KNOWLEDGE.safety.purging
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

    return "I'm here to help! You can ask about location, delivery, opening hours, skincare routines, ingredients, or skin concerns. What would you like to know?"
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false
    }

    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        isBot: true
      }
      setMessages(prev => [...prev, botMessage])
    }, 500)

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'Where is Medglow Pharmacy located?',
    'Opening hours',
    'Delivery info',
    'Daily skincare routine',
    'Oily skin routine',
    'Melasma treatment',
    'Sunscreen importance',
    'Glycolic acid info',
    'Kojic acid info'
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-amber-400 text-slate-950 rounded-full shadow-lg hover:bg-amber-500 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
        aria-label="Chat with GlowMaya"
      >
        <Leaf className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-amber-400 text-slate-950 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">GlowMaya</h3>
                <p className="text-xs text-slate-800">MedGlow Pharmacy Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-950 hover:text-slate-700 transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {messages.length <= 2 && (
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-slate-600 font-medium">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInputValue(q)
                        setTimeout(() => handleSend(), 10)
                      }}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-full hover:bg-slate-100 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about skincare or our services..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-amber-400 text-slate-900 text-sm"
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
        </div>
      )}
    </>
  )
}