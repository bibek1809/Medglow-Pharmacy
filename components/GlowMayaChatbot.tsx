'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Leaf } from 'lucide-react'

type Message = {
  id: string
  text: string
  isBot: boolean
}

const WEBSITE_CONTENT = {
  location: 'Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal (44800)',
  deliveryAvailability: 'We deliver across Nepal via partner services. Orders for non-prescription skincare and baby care items can be placed through WhatsApp, Instagram, or TikTok. Delivery typically takes 1-3 business days depending on location.',
  openingTime: 'We are open Monday through Sunday from 8:00 AM to 8:00 PM. Walk-ins are welcome during these hours.',
  contact: '+977 9763259854',
  services: [
    {
      name: 'Skincare Consultation',
      description: 'Personalized skincare recommendations for hydration, glow, and sensitive skin. We help you choose effective, trusted products.'
    },
    {
      name: 'On-site Blood Testing',
      description: 'Fast and hygienic sample collection with clear guidance on results and follow-up care. Designed for routine wellness checks.'
    },
    {
      name: 'Baby Care Essentials',
      description: 'Curated baby-safe products for skin, hygiene, and nutrition. Reliable choices for new parents and growing families.'
    }
  ],
  skincareRoutine: {
    facewash: 'A gentle cleanser that removes dirt, oil, and impurities without stripping your skin\'s natural barrier. Use twice daily - morning and night before applying other products.',
    moisturizer: 'Hydrates and protects your skin. Choose water-based for oily skin or cream-based for dry skin. Apply after cleansing while skin is still damp.',
    toner: 'Balances skin pH and prepares skin for better absorption of subsequent products. Use after cleansing and before moisturizer.',
    serum: 'Concentrated treatment with active ingredients targeting specific concerns like hydration, brightening, or anti-aging. Apply after toner, before moisturizer.',
    eyeCream: 'Lightweight formula for the delicate eye area. Helps with dark circles, puffiness, and fine lines. Gently pat around the orbital bone.',
    sunblock: 'Essential SPF 30+ or higher to protect against UV damage. Apply daily as the last step in your morning routine, reapply every 2 hours outdoors.'
  },
  skincareTips: [
    'Cleanse your face twice daily with a gentle facewash',
    'Apply moisturizer to keep skin hydrated and protected',
    'Use toner to balance skin pH and prep for treatments',
    'Serums deliver concentrated benefits for specific concerns',
    'Eye cream for the delicate under-eye area',
    'Never skip sunblock - daily SPF is crucial for skin health',
    'Introduce new products gradually, one at a time',
    'Be consistent with your routine for best results'
  ]
}

export default function GlowMayaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm GlowMaya, your skincare assistant from MedGlow Pharmacy. How can I help you today? You can ask me about our location, delivery, opening hours, or skincare routine basics!",
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

    if (lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('dadhikot')) {
      return `We're located at ${WEBSITE_CONTENT.location}. Visit us during our opening hours for in-person assistance!`
    }

    if (lowerQuery.includes('delivery') || lowerQuery.includes('deliver') || lowerQuery.includes('shipping') || lowerQuery.includes('ship')) {
      return WEBSITE_CONTENT.deliveryAvailability
    }

    if (lowerQuery.includes('open') || lowerQuery.includes('hour') || lowerQuery.includes('time') || lowerQuery.includes('close')) {
      return WEBSITE_CONTENT.openingTime
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('call')) {
      return `You can reach us at ${WEBSITE_CONTENT.contact} via WhatsApp, or message us on Instagram @medglow.pharmacy.skincare and TikTok @medglowpharmacy.skincare.`
    }

    if (lowerQuery.includes('service') || lowerQuery.includes('what do you offer')) {
      return `We offer:\n• ${WEBSITE_CONTENT.services[0].name}: ${WEBSITE_CONTENT.services[0].description}\n• ${WEBSITE_CONTENT.services[1].name}: ${WEBSITE_CONTENT.services[1].description}\n• ${WEBSITE_CONTENT.services[2].name}: ${WEBSITE_CONTENT.services[2].description}`
    }

    if (lowerQuery.includes('facewash') || lowerQuery.includes('face wash') || lowerQuery.includes('cleanser')) {
      return `Facewash: ${WEBSITE_CONTENT.skincareRoutine.facewash}`
    }

    if (lowerQuery.includes('moisturizer') || lowerQuery.includes('moisturise') || lowerQuery.includes('cream')) {
      return `Moisturizer: ${WEBSITE_CONTENT.skincareRoutine.moisturizer}`
    }

    if (lowerQuery.includes('toner')) {
      return `Toner: ${WEBSITE_CONTENT.skincareRoutine.toner}`
    }

    if (lowerQuery.includes('serum')) {
      return `Serum: ${WEBSITE_CONTENT.skincareRoutine.serum}`
    }

    if (lowerQuery.includes('eye cream') || lowerQuery.includes('dark circle') || lowerQuery.includes('puffy eyes')) {
      return `Eye Cream: ${WEBSITE_CONTENT.skincareRoutine.eyeCream}`
    }

    if (lowerQuery.includes('sunblock') || lowerQuery.includes('sunscreen') || lowerQuery.includes('spf') || lowerQuery.includes('sun block')) {
      return `Sunblock: ${WEBSITE_CONTENT.skincareRoutine.sunblock}`
    }

    if (lowerQuery.includes('routine') || lowerQuery.includes('daily skincare') || lowerQuery.includes('skincare steps') || lowerQuery.includes('how to use')) {
      return `A basic daily skincare routine includes:\n${WEBSITE_CONTENT.skincareTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`
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

    return "I'm here to help! You can ask me about our location, delivery service, opening hours, or skincare basics like facewash, moisturizer, toner, serum, eye cream, and sunblock. What would you like to know?"
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-amber-400 text-slate-950 rounded-full shadow-lg hover:bg-amber-500 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
        aria-label="Chat with GlowMaya"
      >
        <Leaf className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-amber-400 text-slate-950 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">GlowMaya</h3>
                <p className="text-xs opacity-80">MedGlow Pharmacy Assistant</p>
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
            {messages.length === 1 && (
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-slate-500">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {['Opening hours', 'Delivery info', 'Skincare routine', 'Facewash', 'Moisturizer', 'Sunblock'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInputValue(q)
                        setTimeout(() => handleSend(), 0)
                      }}
                      className="text-xs px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 transition"
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