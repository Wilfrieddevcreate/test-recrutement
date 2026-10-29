/** Génère un fichier iCalendar (.ics) pour ajouter le cours à l'agenda du parent. */
export function buildCalendarFile(booking) {
  const { tutor, slot, subject, level, reference } = booking
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tutoring Match//FR',
    'BEGIN:VEVENT',
    `UID:${reference}@tutoring-match`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(new Date(slot.starts_at))}`,
    `DTEND:${toIcsDate(new Date(slot.ends_at))}`,
    `SUMMARY:${escapeIcs(`Cours de ${subject} (${level}) avec ${tutor.first_name}`)}`,
    `DESCRIPTION:${escapeIcs(`Cours particulier en visioconférence. Référence : ${reference}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }))
}

function toIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcs(text) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
}
