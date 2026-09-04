import { createClient, createAdminClient } from '@/lib/supabase/server'
import { adToBs, parseReportDate } from '@/lib/nepali-date'

const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL ?? 'pharmacymedglow@gmail.com'

async function requireAdmin() {
  const session = await createClient()
  const { data } = await session.auth.getUser()
  const user = data.user
  const allowed = user && (user.email === ADMIN_EMAIL || user.user_metadata?.is_admin === true)
  return allowed ? user : null
}

const numericFields = ['total_sales','total_customers','offline_customers','offline_sales','tiktok_customers','tiktok_sales','instagram_customers','instagram_sales','whatsapp_customers','whatsapp_sales','expenses'] as const

function clean(body: Record<string, unknown>) {
  const inputDate = typeof body.reportDate === 'string' ? body.reportDate : body.report_date
  const report_date = parseReportDate(inputDate, body.dateSystem)
  const values: Record<string, unknown> = { report_date, notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : null }
  for (const key of numericFields) {
    const value = Number(body[key] ?? 0)
    if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid ${key}`)
    values[key] = key.includes('customers') ? Math.floor(value) : Math.round(value * 100) / 100
  }
  return values
}

export async function GET() {
  if (!await requireAdmin()) return Response.json({ error: 'Admin access required' }, { status: 403 })
  const { data, error } = await createAdminClient().from('admin_reports').select('*').order('report_date', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  const reports = (data ?? []).map((report) => ({ ...report, bs_date: adToBs(report.report_date) }))
  return Response.json({ reports })
}

export async function POST(req: Request) {
  const user = await requireAdmin()
  if (!user) return Response.json({ error: 'Admin access required' }, { status: 403 })
  try {
    const values = clean(await req.json())
    const { data, error } = await createAdminClient().from('admin_reports').upsert({ ...values, created_by: user.id, updated_at: new Date().toISOString() }, { onConflict: 'report_date' }).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ report: data })
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Invalid report' }, { status: 400 }) }
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) return Response.json({ error: 'Admin access required' }, { status: 403 })
  const { id } = await req.json().catch(() => ({}))
  if (typeof id !== 'string') return Response.json({ error: 'Report id is required' }, { status: 400 })
  const { error } = await createAdminClient().from('admin_reports').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export const PATCH = POST

type _NumericField = typeof numericFields[number]
void (0 as unknown as _NumericField)

/** Reporting endpoint intentionally keeps all writes server-side and admin-gated. */
export const dynamic = 'force-dynamic'
