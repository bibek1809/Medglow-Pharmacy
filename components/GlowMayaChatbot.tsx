'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { X, Send, Leaf, MapPin, Truck, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react'

type Message = {
  id: string
  text: string
  isBot: boolean
  source?: 'gemini' | 'chatgpt' | 'fallback'
}

type ApiMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MEDGLOW_INFO = {
  location: 'Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal 44800',
  maps: 'https://maps.app.goo.gl/PgU5XyrT5geDbR3p9',
  phone: '+977 9763259854',
  whatsapp: 'https://wa.me/9779763259854',
  email: 'pharmacymedglow@gmail.com',
  instagram: '@medglow.pharmacy.skincare',
  tiktok: '@medglowpharmacy.skincare',
  hours: 'Monday to Sunday, 8:00 AM to 8:00 PM',
  freeDelivery: 'Orders above NPR 20000 get free delivery'
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  isBot: true,
  source: 'fallback',
  text: `Hello! I'm GlowMaya, MedGlow Pharmacy's professional skincare and pharmacy assistant.`
}

function getFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('map') || lowerQuery.includes('dadhikot') || lowerQuery.includes('harsha chowk')) {
    return `📍 MedGlow Pharmacy is located at ${MEDGLOW_INFO.location}.\n\nGoogle Maps: ${MEDGLOW_INFO.maps}`
  }

  if (lowerQuery.includes('hour') || lowerQuery.includes('open') || lowerQuery.includes('close') || lowerQuery.includes('holiday')) {
    return `🕒 MedGlow Pharmacy is open ${MEDGLOW_INFO.hours}.\n\nWalk-ins are welcome. For urgent medicine or skincare help, message us on WhatsApp: ${MEDGLOW_INFO.phone}.`
  }

  if (lowerQuery.includes('delivery') || lowerQuery.includes('deliver') || lowerQuery.includes('shipping') || lowerQuery.includes('cod')) {
    return `📦 MedGlow delivers across Nepal, usually within 1-3 business days.\n\n${MEDGLOW_INFO.freeDelivery}.\n\nOrder through WhatsApp, Instagram, or TikTok. Exact delivery charges depend on location, so message us on WhatsApp: ${MEDGLOW_INFO.phone}.`
  }

  if (lowerQuery.includes('payment') || lowerQuery.includes('pay') || lowerQuery.includes('esewa') || lowerQuery.includes('khalti')) {
    return `💳 MedGlow accepts Cash, eSewa, Khalti, and bank transfer. For online orders, message us on WhatsApp and we'll confirm the best payment method.`
  }

  if (lowerQuery.includes('service') || lowerQuery.includes('blood test') || lowerQuery.includes('prescription') || lowerQuery.includes('baby') || lowerQuery.includes('vitamin')) {
    return `🏥 MedGlow offers prescription fulfillment, skincare consultation, on-site blood testing, baby care essentials, vitamins and supplements, first aid supplies, and elderly care products.\n\nVisit /pharmacy-services or message us on WhatsApp: ${MEDGLOW_INFO.phone}.`
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('whatsapp') || lowerQuery.includes('instagram') || lowerQuery.includes('tiktok')) {
    return `📞 Contact MedGlow Pharmacy:\n• WhatsApp: ${MEDGLOW_INFO.phone}\n• Email: ${MEDGLOW_INFO.email}\n• Instagram: ${MEDGLOW_INFO.instagram}\n• TikTok: ${MEDGLOW_INFO.tiktok}`
  }

  if (lowerQuery.includes('routine') || lowerQuery.includes('skincare')) {
    return `🌿 Basic skincare routine:\n1. Gentle cleanser\n2. Hydrating toner\n3. Serum based on your concern\n4. Moisturizer\n5. SPF 30+ in the morning\n\nTell me your skin type and main concern, and I'll suggest a personalized routine.`
  }

  return `I can help with MedGlow Pharmacy, skincare routines, ingredients, prescriptions, delivery, payment, contact, hours, and ordering. For exact stock or pricing, message us on WhatsApp: ${MEDGLOW_INFO.phone}.`
}

export default function GlowMayaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
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

  const getAIResponse = async (query: string, history: ApiMessage[]): Promise<{ text: string; source: Message['source'] }> => {
    const cached = responseCache.current.get(query.toLowerCase())
    if (cached) return { text: cached, source: 'fallback' }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 9000)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const reply = data.reply || getFallbackResponse(query)
        responseCache.current.set(query.toLowerCase(), reply)
        return { text: reply, source: data.source || 'fallback' }
      }
    } catch {
      // fallback handled below
    }

    return { text: getFallbackResponse(query), source: 'fallback' }
  }

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false
    }

    const history: ApiMessage[] = messages.map((message) => ({
      role: message.isBot ? 'assistant' : 'user',
      content: message.text
    }))

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const response = await getAIResponse(text, history)

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isBot: true,
      source: response.source
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    { icon: MapPin, text: 'Location & Hours' },
    { icon: Truck, text: `Free delivery above NPR 20000` },
    { icon: ShieldCheck, text: 'Payment Options' },
    { icon: Stethoscope, text: 'Blood Testing' },
    { icon: Sparkles, text: 'Daily Skincare Routine' },
    { icon: Leaf, text: 'Oily Skin & Acne' },
    { icon: Leaf, text: 'Melasma & Dark Spots' },
    { icon: Leaf, text: 'Pregnancy Skincare' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-full shadow-xl shadow-amber-400/20 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
        aria-label="Chat with GlowMaya"
      >
        <Leaf className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-[min(94vw,420px)] ${isMinimized ? 'h-16' : 'h-[620px]'} bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all duration-300`}>
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-11 h-11 bg-slate-950 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base truncate">GlowMaya</h3>
                <p className="text-[11px] text-slate-800 truncate">MedGlow AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized((prev) => !prev)
                }}
                className="text-slate-950 hover:text-slate-700 transition p-1"
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? <Leaf className="w-4 h-4" /> : <X className="w-4 h-4" />}
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
                    className={`max-w-[88%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        : 'bg-amber-400 text-slate-950 rounded-tr-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    {message.isBot && message.source && (
                      <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">{message.source}</p>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-none">
                    <p className="text-sm italic">GlowMaya is checking MedGlow pharmacy and skincare details...</p>
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
                  placeholder="Ask about skincare, medicines, delivery, or MedGlow..."
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
              <p className="mt-2 text-[10px] text-center text-slate-400">
                Powered by AI. For medical emergencies, contact a doctor or pharmacist.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
