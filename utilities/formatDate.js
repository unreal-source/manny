import { DateTime } from 'luxon'

export default function formatDate (date) {
  return DateTime.fromISO(date.toISO()).toLocaleString(DateTime.DATETIME_FULL)
}
