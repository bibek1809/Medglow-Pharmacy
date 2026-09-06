import { read, utils } from 'xlsx'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { bsToAd } from '@/lib/nepali-date'
import { ensureAdminReportsTable } from '@/lib/admin-reports-schema'

const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL ?? 'pharmacymedglow@gmail.com'
const numericFields = {
  'Total Sales': 'total_sales',
  'Total Customer': 'total_customers',
  'Offline Customer': 'offline_customers',
  'Offline Sales': 'offline_sales',
  'Total Tiktok Customer': 'tiktok_customers',
  'Online Sales-Tiktok': 'tiktok_sales',
  'Total Insta Customer': 'instagram_customers',
  'Online Sales-Insta': 'instagram_sales',
  'Total WA Customer': 'whatsapp_customers',
  'Online Sales -WA': 'whatsapp_sales',
  'Expenses ': 'expenses',
} as const

async function requireAdmin() {
  const { data } = await (await createClient()).auth.getUser()
  const user = data.user
  return user && (user.email === ADMIN_EMAIL || user.user_metadata?.is_admin === true) ? user : null
}

function parseBsCell(value: unknown) {
  if (value instanceof Date) {
    throw new Error('The Date column must be a Bikram Sambat date such as 2083-05-01, not an Excel Gregorian date.')
  }
  const text = String(value ?? '').trim()
  const match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (!match) throw new Error(`Invalid BS date: ${text}`)
  return bsToAd(`${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`)
}

function numberValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 0
  const number = Number(String(value).replace(/,/g, '').replace(/%$/, ''))
  if (!Number.isFinite(number) || number < 0) throw new Error(`Invalid numeric value: ${String(value)}`)
  return number
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return Response.json({ error: 'Admin access required' }, { status: 403 })
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return Response.json({ error: 'Attach an .xlsx workbook' }, { status: 400 })
  if (!file.name.toLowerCase().endsWith('.xlsx')) return Response.json({ error: 'Only .xlsx files are supported' }, { status: 400 })

  try {
    await ensureAdminReportsTable()
    const workbook = read(Buffer.from(await file.arrayBuffer()), { cellDates: true })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null })
    const reports = rows.map((row, index) => {
      if (!row.Date && !row.date) return null
      const report: Record<string, unknown> = { report_date: parseBsCell(row.Date ?? row.date), created_by: user.id, notes: `Imported from ${file.name}` }
      for (const [source, target] of Object.entries(numericFields)) report[target] = numberValue(row[source])
      if (report.total_customers === undefined) report.total_customers = numberValue(row['Customers (Total)'])
      return { ...report, row: index + 2 }
    }).filter((report): report is Record<string, unknown> & { row: number; report_date: string } => report !== null)
    if (!reports.length) return Response.json({ error: 'No dated report rows found. Use the provided template headers.' }, { status: 400 })
    const duplicateDates = reports.filter((item, index) => reports.findIndex((other) => other.report_date === item.report_date) !== index)
    if (duplicateDates.length) return Response.json({ error: `Duplicate BS dates found in workbook near row ${duplicateDates[0].row}` }, { status: 400 })
    const payload = reports.map(({ row: _row, ...report }) => ({ ...report, updated_at: new Date().toISOString() }))
    const { data, error } = await createAdminClient().from('admin_reports').upsert(payload, { onConflict: 'report_date' }).select('id,report_date')
    if (error) return Response.json({ error: `Import failed: ${error.message}` }, { status: 500 })
    return Response.json({ imported: data?.length ?? 0 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to import workbook' }, { status: 400 })
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
