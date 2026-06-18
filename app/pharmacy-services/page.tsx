import Link from 'next/link'
import { MapPin, Clock, Phone, Stethoscope, Sparkles, Baby, ShieldCheck, Pill, HeartPulse } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    title: 'Skincare Consultation',
    description: 'Personalized skincare guidance for acne, pigmentation, dryness, oily skin, sensitive skin, and daily routines.'
  },
  {
    icon: Pill,
    title: 'Prescription Fulfillment',
    description: 'Bring your valid prescription to our Dadhikot counter for pharmacist-assisted medicine support.'
  },
  {
    icon: Stethoscope,
    title: 'On-site Blood Testing',
    description: 'Fast and hygienic sample collection with clear guidance for routine wellness checks.'
  },
  {
    icon: Baby,
    title: 'Baby Care Essentials',
    description: 'Curated baby-safe products for skincare, hygiene, and nutrition for new parents and growing families.'
  },
  {
    icon: ShieldCheck,
    title: 'Vitamins & Supplements',
    description: 'Trusted vitamins, supplements, and wellness products selected with pharmacy-level care.'
  },
  {
    icon: HeartPulse,
    title: 'First Aid & Elderly Care',
    description: 'First aid supplies, elderly care products, and supportive pharmacy essentials.'
  }
]

export default function PharmacyServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em]">Pharmacy Services</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Professional care for skin, baby, and wellbeing
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light">
              MedGlow Pharmacy combines trusted products with practical pharmacy guidance at Harsha Chowk, Dadhikot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/9779763259854"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-500 transition"
              >
                Message on WhatsApp
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold hover:bg-slate-800 transition">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">GlowMaya AI Assistant</h2>
                <p className="text-slate-300 text-sm mt-1">Ask about skincare routines, ingredients, delivery, and pharmacy services.</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Free Delivery</p>
                <p className="text-amber-400 font-semibold mt-2">Orders above NPR 20000</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Hours</p>
                <p className="text-white font-semibold mt-2">8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center">
                <service.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold mt-5">{service.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
            <MapPin className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold mt-4">Visit MedGlow</h2>
            <p className="text-slate-600 text-sm mt-2">Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal</p>
          </div>
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
            <Clock className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold mt-4">Opening Hours</h2>
            <p className="text-slate-600 text-sm mt-2">Monday to Sunday, 8:00 AM to 8:00 PM</p>
          </div>
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
            <Phone className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold mt-4">Order Support</h2>
            <p className="text-slate-600 text-sm mt-2">WhatsApp +977 9763259854</p>
          </div>
        </div>
      </section>
    </main>
  )
}
