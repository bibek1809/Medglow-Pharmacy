import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Clock, MessageCircle } from 'lucide-react'

const contactItems = [
  {
    icon: MapPin,
    title: 'Location',
    value: 'Suryabinayak-4, Dadhikot, Harsha Chowk, Bagmati Province, Nepal',
    href: 'https://maps.app.goo.gl/PgU5XyrT5geDbR3p9'
  },
  {
    icon: Phone,
    title: 'Phone / WhatsApp',
    value: '+977 9763259854',
    href: 'https://wa.me/9779763259854'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'pharmacymedglow@gmail.com',
    href: 'mailto:pharmacymedglow@gmail.com'
  },
  {
    icon: Clock,
    title: 'Hours',
    value: 'Monday to Sunday, 8:00 AM to 8:00 PM',
    href: '/pharmacy-services'
  }
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em]">Contact MedGlow Pharmacy</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Reach us for skincare, medicines, delivery, and pharmacy support
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-light">
              Message us for stock, pricing, skincare guidance, prescription support, baby care, blood testing, or delivery details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/9779763259854"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-500 transition"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Now
              </a>
              <Link href="/pharmacy-services" className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold hover:bg-slate-800 transition">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mt-5">{item.title}</p>
              <p className="text-lg font-bold mt-2">{item.value}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Social Channels</h2>
            <p className="text-slate-600 text-sm mt-3">Follow MedGlow Pharmacy for product updates, skincare tips, and daily offers.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://www.instagram.com/medglow.pharmacy.skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-5 py-4 text-white font-semibold text-sm"
              >
                <Instagram className="w-4 h-4 mr-2 inline" />
                @medglow.pharmacy.skincare
              </a>
              <a
                href="https://www.tiktok.com/@medglowpharmacy.skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-slate-950 px-5 py-4 text-white font-semibold text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2 inline" />
                @medglowpharmacy.skincare
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Delivery Reminder</h2>
            <p className="text-slate-600 text-sm mt-3">
              MedGlow delivers across Nepal, usually within 1-3 business days. Orders above <strong>NPR 20000</strong> get free delivery.
            </p>
            <p className="text-slate-600 text-sm mt-4">
              For exact stock, pricing, and location-based delivery charges, message us on WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
