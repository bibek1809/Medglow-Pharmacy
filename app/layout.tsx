import GlowMayaChatbot from '@/components/GlowMayaChatbot'
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
  metadataBase: new URL('https://medglowpharmacy.com'),
  title: 'MedGlow Pharmacy | Premium Skincare, Baby Care & Wellness - Dadhikot, Nepal',
  description: 'MedGlow Pharmacy delivers premium skincare, baby care essentials, blood tests, and trusted wellness consultation in Dadhikot. Order securely through WhatsApp, Instagram, or TikTok.',
  keywords: 'pharmacy dadhikot, skincare consultation nepal, blood test services nepal, baby care products nepal, COSRX nepal, CeraVe nepal, wellness pharmacy, WhatsApp order, TikTok pharmacy updates, Instagram pharmacy',
  authors: [{ name: 'MedGlow Pharmacy' }],
  creator: 'MedGlow Pharmacy',
  publisher: 'MedGlow Pharmacy',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: 'MedGlow Pharmacy | Premium Skincare & Wellness - Dadhikot',
    description: 'Professional pharmacy with dermatologist-recommended skincare brands, baby care essentials, and reliable wellness services in Dadhikot, Nepal.',
    type: 'website',
    locale: 'en_NP',
    siteName: 'MedGlow Pharmacy',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-06-17%20at%207.39.47%20AM-lYqHqlYkytZWfbVVX41lI2CVnioVpJ.jpeg',
        width: 1200,
        height: 630,
        alt: 'MedGlow Pharmacy logo and premium skincare services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedGlow Pharmacy | Premium Skincare & Wellness',
    description: 'Explore authentic skincare brands, baby care essentials, blood test services, and expert pharmacy support in Dadhikot.',
    site: '@medglowpharmacy',
    creator: '@medglowpharmacy',
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
        <GlowMayaChatbot />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
