import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const sessionClient = await createClient()
  const { data, error } = await sessionClient
    .from('news')
    .select('id, news_title, picture_link, headline, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ news: data })
}
