export type EventStatus = 'upcoming' | 'live' | 'past'

function toLocalYMD(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getEventStatus(dateInput: string | Date): EventStatus {
  const eventDate = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const today = new Date()

  const eventYMD = toLocalYMD(eventDate)
  const todayYMD = toLocalYMD(today)

  if (eventYMD === todayYMD) return 'live'
  if (eventYMD > todayYMD) return 'upcoming'
  return 'past'
}

export function getStatusDotClass(status: EventStatus) {
  if (status === 'upcoming') return 'bg-[#18CB96]'
  if (status === 'live') return 'bg-red-500'
  return 'bg-gray-300'
}

export function formatEventDate(input: string | Date) {
  const date = input instanceof Date ? input : new Date(input)
  const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date)
  const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(date)
  return `${day} ${month}, ${year}`
}
