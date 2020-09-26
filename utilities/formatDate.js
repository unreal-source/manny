import { DateTime } from 'luxon'

export default function formatDate (date, sql = false) {
  if (sql) {
    return DateTime.fromObject(date).toLocaleString(DateTime.DATETIME_FULL)
  }

  return DateTime.fromISO(date.toISO()).toLocaleString(DateTime.DATETIME_FULL)
}
