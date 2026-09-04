import NepaliDate from 'nepali-date-converter'

export const BS_MONTHS = ['Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Aswin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'] as const

export function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function adToBs(value: string | Date): string {
  const bs = new NepaliDate(typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value).getBS()
  return `${bs.year}-${String(bs.month + 1).padStart(2, '0')}-${String(bs.date).padStart(2, '0')}`
}

export function bsToAd(value: string): string {
  if (!isValidDateString(value)) throw new Error('Use a valid date in YYYY-MM-DD format')
  const [year, month, date] = value.split('-').map(Number)
  const ad = new NepaliDate(year, month - 1, date).toJsDate()
  if (Number.isNaN(ad.getTime())) throw new Error('That Bikram Sambat date is not valid')
  return `${ad.getUTCFullYear()}-${String(ad.getUTCMonth() + 1).padStart(2, '0')}-${String(ad.getUTCDate()).padStart(2, '0')}`
}

export function formatBs(value: string | Date) {
  const [year, month, date] = adToBs(value).split('-').map(Number)
  return `${date} ${BS_MONTHS[month - 1]} ${year}`
}

export function currentBsDate() {
  return adToBs(new Date())
}

export function bsMonthLabel(value: string) {
  const [year, month] = value.split('-').map(Number)
  return `${BS_MONTHS[month - 1]} ${year}`
}

export function bsYearMonth(value: string) {
  return adToBs(value).slice(0, 7)
}

export function parseReportDate(value: unknown, system: unknown) {
  if (typeof value !== 'string' || !isValidDateString(value)) throw new Error('A valid date is required')
  return system === 'bs' ? bsToAd(value) : value
}

export function safeFormatBs(value: string) {
  try { return formatBs(value) } catch { return 'Invalid BS date' }
}

export function getTodayAd() { return new Date().toISOString().slice(0, 10) }
export function getTodayBs() { return currentBsDate() }
export const bsMonthNames = BS_MONTHS
