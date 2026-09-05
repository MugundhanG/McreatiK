/* ============================================
   eventDate helpers
   Small pure date utilities shared by
   EventDatePicker and whatever form uses it.
   Split out from the component file so it only
   exports the component (Fast Refresh requirement).
   ============================================ */

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function toISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseISO(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return { year: y, month: m - 1, day: d }
}

export function formatDisplay(iso) {
  const parsed = parseISO(iso)
  if (!parsed) return ''
  return `${String(parsed.day).padStart(2, '0')} ${MONTHS[parsed.month].slice(0, 3)} ${parsed.year}`
}

export function isPastDate(year, month, day, today) {
  const date = new Date(year, month, day)
  date.setHours(0, 0, 0, 0)
  return date < today
}
