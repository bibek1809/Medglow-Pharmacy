export async function GET() {
  return new Response(JSON.stringify({
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    note: 'Remove this endpoint in production after debugging.'
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
