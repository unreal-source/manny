import { DateTime } from 'luxon'

export default function formatDate (date) {
  return DateTime.fromObject(date).toLocaleString(DateTime.DATETIME_FULL)
}
