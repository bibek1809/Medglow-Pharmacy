'use client'

import { useMemo, useState } from 'react'

const fields = [
  ['total_sales','Total sales'],['total_customers','Total customers'],['offline_customers','Offline customers'],['offline_sales','Offline sales'],
  ['tiktok_customers','TikTok customers'],['tiktok_sales','TikTok sales'],['instagram_customers','Instagram customers'],['instagram_sales','Instagram sales'],
  ['whatsapp_customers','WhatsApp customers'],['whatsapp_sales','WhatsApp sales'],['expenses','Expenses'],
] as const

type Report = Record<string, any>
const money = (n: number) => `NPR ${Number(n || 0).toLocaleString('en-NP', { maximumFractionDigits: 0 })}`
const avg = (rows: Report[], key: string) => rows.length ? rows.reduce((s, r) => s + Number(r[key] || 0), 0) / rows.length : 0

export default function AdminReportsTab({ reports, onRefresh, onError, onSuccess }: { reports: Report[]; onRefresh: () => void; onError: (message: string) => void; onSuccess: (message: string) => void }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState<Record<string, any>>({ report_date: today })
  const [range, setRange] = useState('month')
  const filtered = useMemo(() => {
    const now = new Date()
    return reports.filter((r) => range === 'all' || (now.getTime() - new Date(r.report_date).getTime()) <= (range === 'year' ? 365 : 31) * 86400000)
  }, [reports, range])
  const totalSales = filtered.reduce((s, r) => s + Number(r.total_sales || 0), 0)
  const totalExpenses = filtered.reduce((s, r) => s + Number(r.expenses || 0), 0)
  const totalCustomers = filtered.reduce((s, r) => s + Number(r.total_customers || 0), 0)
  const averageSales = avg(filtered, 'total_sales')
  const maxSales = Math.max(...filtered.map((r) => Number(r.total_sales || 0)), 0)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/reports', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save report')
      setForm({ report_date: today }); onRefresh(); onSuccess('Daily report saved successfully')
    } catch (error) { onError(error instanceof Error ? error.message : 'Unable to save report') }
  }
  return <div className="space-y-6">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Business intelligence</p><h2 className="mt-2 text-3xl font-bold">Daily reporting platform</h2><p className="mt-2 text-slate-400">Capture the day, then compare performance across channels and time.</p></div>
      <div className="flex gap-2"><select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm"><option value="month">Last 31 days</option><option value="year">Last year</option><option value="all">All records</option></select></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Revenue',money(totalSales)],['Expenses',money(totalExpenses)],['Customers',totalCustomers.toLocaleString()],['Daily average',money(averageSales)]].map(([label,value]) => <div key={label} className="rounded-3xl border border-slate-700 bg-slate-800 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold text-amber-400">{value}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><h3 className="text-xl font-bold">Add or update a day</h3><p className="mt-1 text-sm text-slate-400">Saving the same date updates its existing summary.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-sm text-slate-300">Date<input type="date" required value={form.report_date || ''} onChange={(e) => setForm({...form, report_date:e.target.value})} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white" /></label>{fields.map(([key,label]) => <label key={key} className="text-sm text-slate-300">{label}<input type={key.includes('customers') ? 'number' : 'number'} min="0" step={key.includes('customers') ? '1' : '0.01'} value={form[key] ?? ''} onChange={(e) => setForm({...form, [key]:e.target.value})} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white" /></label>)}<label className="sm:col-span-2 text-sm text-slate-300">Notes<textarea value={form.notes || ''} onChange={(e) => setForm({...form, notes:e.target.value})} className="mt-2 min-h-20 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-white" /></label></div><button className="mt-5 w-full rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950 hover:bg-amber-300">Save daily summary</button></form>
      <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Performance trend</h3><p className="text-sm text-slate-400">Sales by recorded day</p></div><span className="text-sm text-emerald-400">Net {money(totalSales-totalExpenses)}</span></div><div className="mt-8 flex h-56 items-end gap-2 overflow-x-auto border-b border-slate-700 pb-2">{filtered.slice().reverse().map((r) => <div key={r.id} className="flex min-w-8 flex-1 flex-col items-center gap-2" title={`${r.report_date}: ${money(r.total_sales)}`}><div className="w-full rounded-t-lg bg-amber-400" style={{ height: `${maxSales ? Math.max(6, (Number(r.total_sales || 0) / maxSales) * 180) : 6}px` }} /><span className="text-[10px] text-slate-500">{r.report_date.slice(5)}</span></div>)}{!filtered.length && <p className="m-auto text-sm text-slate-500">No reports in this period yet.</p>}</div></div>
    </div>
    <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-800"><div className="min-w-[980px]"><div className="flex items-center justify-between p-6"><div><h3 className="text-xl font-bold">Daily ledger</h3><p className="text-sm text-slate-400">Monthly averages update automatically from the selected range.</p></div></div><table className="w-full text-left text-sm"><thead className="bg-slate-700 text-slate-300"><tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Sales</th><th className="px-5 py-3">Customers</th><th className="px-5 py-3">Offline</th><th className="px-5 py-3">TikTok</th><th className="px-5 py-3">Instagram</th><th className="px-5 py-3">WhatsApp</th><th className="px-5 py-3">Expenses</th><th className="px-5 py-3">Net</th></tr></thead><tbody>{filtered.map((r) => <tr key={r.id} className="border-t border-slate-700"><td className="px-5 py-3">{r.report_date}</td><td className="px-5 py-3 text-amber-400">{money(r.total_sales)}</td><td className="px-5 py-3">{r.total_customers}</td><td className="px-5 py-3">{money(r.offline_sales)} ({r.offline_percentage}%)</td><td className="px-5 py-3">{money(r.tiktok_sales)}</td><td className="px-5 py-3">{money(r.instagram_sales)}</td><td className="px-5 py-3">{money(r.whatsapp_sales)}</td><td className="px-5 py-3">{money(r.expenses)}</td><td className="px-5 py-3 text-emerald-400">{money(Number(r.total_sales)-Number(r.expenses))}</td></tr>)}</tbody></table></div></div>
  </div>
}
