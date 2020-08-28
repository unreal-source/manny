import { DateTime } from 'luxon'

export default function formatDate (date) {
  return DateTime.fromISO(date.toISOString()).toLocaleString(DateTime.DATETIME_FULL)
}
