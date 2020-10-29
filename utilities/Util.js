import { DateTime } from 'luxon'

class Util {
  static capitalize (str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  static prettyDate (date) {
    return DateTime.fromObject(date).toLocaleString(DateTime.DATETIME_FULL)
  }

  static random (array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  static thousands (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export default Util
