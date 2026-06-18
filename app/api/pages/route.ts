import { NextRequest } from 'next/server'

const PAGE_SECTIONS = [
  {
    id: 'home',
    title: 'Home',
    path: '/',
    description: 'MedGlow Pharmacy homepage with services, skincare brands, available listings, and order request.'
  },
  {
    id: 'pharmacy-services',
    title: 'Pharmacy Services',
    path: '/pharmacy-services',
    description: 'Skincare consultation, prescription fulfillment, blood testing, baby care, vitamins, first aid, and elderly care.'
  },
  {
    id: 'brands',
    title: 'Skincare Brands',
    path: '/#brands',
    description: 'Featured skincare brands available at MedGlow Pharmacy.'
  },
  {
    id: 'listing',
    title: 'Available Listing',
    path: '/#listing',
    description: 'Products currently available for pickup or delivery.'
  },
  {
    id: 'order',
    title: 'How To Order',
    path: '/#order',
    description: 'Order request section with WhatsApp, Instagram, and TikTok support.'
  },
  {
    id: 'contact',
    title: 'Contact',
    path: '/contact',
    description: 'MedGlow Pharmacy contact details, location, hours, social channels, and delivery reminder.'
  },
  {
    id: 'admin',
    title: 'Admin Portal',
    path: '/#admin',
    description: 'Admin access for inquiries, products, and news management.'
  }
]

function findPageSection(query: string) {
  const normalized = query.toLowerCase().trim()
  return PAGE_SECTIONS.find((page) =>
    page.id.includes(normalized) ||
    page.title.toLowerCase().includes(normalized) ||
    page.path.toLowerCase().includes(normalized) ||
    page.description.toLowerCase().includes(normalized)
  ) || null
}

export async function GET() {
  return Response.json({
    status: 'ok',
    pages: PAGE_SECTIONS
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const query = typeof body?.section === 'string' ? body.section : ''

    if (!query) {
      return Response.json({ error: 'No section provided' }, { status: 400 })
    }

    const page = findPageSection(query)
    if (!page) {
      return Response.json({ error: 'Page section not found', pages: PAGE_SECTIONS }, { status: 404 })
    }

    return Response.json({ page })
  } catch {
    return Response.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
