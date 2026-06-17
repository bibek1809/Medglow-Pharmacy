import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MedGlow Pharmacy | Premium Skincare, Baby Care & Wellness - Dadhikot, Nepal',
  description: 'Premium pharmacy in Dadhikot offering authentic skincare brands (COSRX, CeraVe, The Ordinary), baby care products, expert consultations, and blood test services. Order via WhatsApp now!',
  keywords: 'pharmacy dadhikot, skincare consultation nepal, blood test service, COSRX nepal, CeraVe dadhikot, baby care products, harsha chowk pharmacy, dermatology clinic',
  authors: [{ name: 'MedGlow Pharmacy' }],
  creator: 'MedGlow Pharmacy',
  publisher: 'MedGlow Pharmacy',
  robots: 'index, follow',
  openGraph: {
    title: 'MedGlow Pharmacy | Premium Skincare & Wellness - Dadhikot',
    description: 'Professional pharmacy with dermatologist-recommended skincare brands and expert wellness services in Dadhikot, Nepal',
    type: 'website',
    locale: 'en_NP',
    siteName: 'MedGlow Pharmacy',
  },
  alternates: {
    canonical: 'https://medglowpharmacy.com',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f5f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
