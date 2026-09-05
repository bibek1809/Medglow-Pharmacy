'use client'

import { useMemo, useState } from 'react'
import { adToBs, bsToAd, formatBs, getTodayAd, getTodayBs } from '@/lib/nepali-date'

type Report = Record<string, any>
const fields = [
  ['total_sales', 'Total sales'], ['total_customers', 'Total customers'], ['offline_customers', 'Offline customers'], ['offline_sales', 'Offline sales'],
  ['tiktok_customers', 'TikTok customers'], ['tiktok_sales', 'TikTok sales'], ['instagram_customers', 'Instagram customers'], ['instagram_sales', 'Instagram sales'],
  ['whatsapp_customers', 'WhatsApp customers'], ['whatsapp_sales', 'WhatsApp sales'], ['expenses', 'Expenses'],
] as const
const money = (n: number) => `NPR ${Number(n || 0).toLocaleString('en-NP', { maximumFractionDigits: 0 })}`
const average = (rows: Report[], key: string) => rows.length ? rows.reduce((sum, row) => sum + Number(row[key] || 0), 0) / rows.length : 0

export default function AdminReportsTab({ reports, onRefresh, onError, onSuccess }: { reports: Report[]; onRefresh: () => void; onError: (message: string) => void; onSuccess: (message: string) => void }) {
  const [dateSystem, setDateSystem] = useState<'bs' | 'ad'>('bs')
  const [range, setRange] = useState('month')
  const [form, setForm] = useState<Record<string, any>>({ reportDate: getTodayBs() })
  const filtered = useMemo(() => {
    if (range === 'all') return reports
    const limit = Date.now() - (range === 'year' ? 365 : 31) * 86400000
    return reports.filter((row) => new Date(row.report_date).getTime() >= limit)
  }, [reports, range])
  const totalSales = filtered.reduce((sum, row) => sum + Number(row.total_sales || 0), 0)
  const expenses = filtered.reduce((sum, row) => sum + Number(row.expenses || 0), 0)
  const customers = filtered.reduce((sum, row) => sum + Number(row.total_customers || 0), 0)
  const update = (key: string, value: unknown) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/admin/reports', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, dateSystem, reportDate: form.reportDate }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save report')
      setForm({ reportDate: dateSystem === 'bs' ? getTodayBs() : getTodayAd() })
      onRefresh(); onSuccess('Daily report saved successfully')
    } catch (error) { onError(error instanceof Error ? error.message : 'Unable to save report') }
  }
  const deleteReport = async (id: string) => {
    if (!window.confirm('Delete this daily report? This cannot be undone.')) return
    try {
      const response = await fetch('/api/admin/reports', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to delete report')
      onRefresh(); onSuccess('Report deleted')
    } catch (error) { onError(error instanceof Error ? error.message : 'Unable to delete report') }
  }
  const switchDateSystem = (system: 'bs' | 'ad') => { setDateSystem(system); update('reportDate', system === 'bs' ? getTodayBs() : getTodayAd()) }
  const maxSales = Math.max(...filtered.map((row) => Number(row.total_sales || 0)), 1)

  return <section aria-labelledby="reports-heading" className="flex flex-col gap-6">
    <header className="flex flex-col gap-4 border-b border-slate-700 pb-6 md:flex-row md:items-end md:justify-between">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Dedicated business intelligence</p><h2 id="reports-heading" className="mt-2 text-3xl font-bold">Daily reporting platform</h2><p className="mt-2 text-slate-400">Bikram Sambat is primary. Gregorian dates remain available for accounting reconciliation.</p></div>
      <label className="text-sm text-slate-400">Reporting period<select value={range} onChange={(event) => setRange(event.target.value)} className="mt-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white"><option value="month">Last 31 days</option><option value="year">Last year</option><option value="all">All records</option></select></label>
    </header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Revenue', money(totalSales)], ['Expenses', money(expenses)], ['Customers', customers.toLocaleString()], ['Daily average', money(average(filtered, 'total_sales'))]].map(([label, value]) => <div key={label} className="rounded-3xl border border-slate-700 bg-slate-800 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold text-amber-400">{value}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold">Add or update a day</h3><p className="mt-1 text-sm text-slate-400">AD reference:</p></div><a href="/templates/report-upload-template.csv" download className="shrink-0 rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-700">Download CSV template</a></div><p className="sr-only">AD reference: {form.reportDate ? (dateSystem === 'bs' ? bsToAd(form.reportDate) : form.reportDate) : '—'}</p><div className="mt-5 flex flex-wrap gap-2">{(['bs', 'ad'] as const).map((system) => <button key={system} type="button" onClick={() => switchDateSystem(system)} className={`rounded-lg px-3 py-2 text-sm ${dateSystem === system ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>{system === 'bs' ? 'Bikram Sambat' : 'AD / Gregorian'}</button>)}</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-300 sm:col-span-2">{dateSystem === 'bs' ? 'BS date (YYYY-MM-DD)' : 'AD date'}<input required type="text" inputMode="numeric" placeholder={dateSystem === 'bs' ? '2083-05-12' : '2026-08-28'} value={form.reportDate || ''} onChange={(event) => update('reportDate', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white" /></label>{fields.map(([key, label]) => <label key={key} className="text-sm text-slate-300">{label}<input type="number" min="0" step={key.includes('customers') ? '1' : '0.01'} value={form[key] ?? ''} onChange={(event) => update(key, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white" /></label>)}<label className="text-sm text-slate-300 sm:col-span-2">Notes<textarea value={form.notes || ''} onChange={(event) => update('notes', event.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white" /></label></div><button type="submit" className="mt-5 w-full rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950 hover:bg-amber-300">Save daily summary</button></form>
      <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><h3 className="text-xl font-bold">Sales trend</h3><p className="text-sm text-slate-400">Daily revenue by BS date</p><div className="mt-8 flex h-56 items-end gap-2 overflow-x-auto border-b border-slate-700 pb-2">{filtered.slice().reverse().map((row) => <div key={row.id} className="flex min-w-8 flex-1 flex-col items-center gap-2" title={`${formatBs(row.report_date)} (${row.report_date})`}><div className="w-full rounded-t-lg bg-amber-400" style={{ height: `${Math.max(6, Number(row.total_sales || 0) / maxSales * 180)}px` }} /><span className="text-[10px] text-slate-500">{row.bs_date || adToBs(row.report_date).slice(5)}</span></div>)}{!filtered.length && <p className="m-auto text-sm text-slate-500">No reports in this period yet.</p>}</div></div>
    </div>
    <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-800"><div className="min-w-[1120px]"><div className="flex items-center justify-between p-6"><div><h3 className="text-xl font-bold">Daily ledger</h3><p className="text-sm text-slate-400">Delete incorrect entries directly from the ledger.</p></div><span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-amber-300">{filtered.length} records</span></div><table className="w-full text-left text-sm"><thead className="bg-slate-700 text-slate-300"><tr>{['BS date', 'AD date', 'Sales', 'Customers', 'Offline', 'TikTok', 'Instagram', 'WhatsApp', 'Expenses', 'Actions'].map((heading) => <th key={heading} className="px-5 py-3">{heading}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-slate-700"><td className="px-5 py-3 text-amber-300">{row.bs_date || formatBs(row.report_date)}</td><td className="px-5 py-3 text-slate-400">{row.report_date}</td><td className="px-5 py-3">{money(row.total_sales)}</td><td className="px-5 py-3">{row.total_customers}</td><td className="px-5 py-3">{money(row.offline_sales)} ({row.offline_percentage}%)</td><td className="px-5 py-3">{money(row.tiktok_sales)}</td><td className="px-5 py-3">{money(row.instagram_sales)}</td><td className="px-5 py-3">{money(row.whatsapp_sales)}</td><td className="px-5 py-3">{money(row.expenses)}</td><td className="px-5 py-3"><button type="button" onClick={() => deleteReport(row.id)} className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium hover:bg-red-500">Delete</button></td></tr>)}</tbody></table></div></div>
  </section>
}
