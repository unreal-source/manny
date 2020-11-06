import { DateTime } from 'luxon'

class Util {
  static capitalize (str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  static prettyDate (date, short = false) {
    return DateTime.fromJSDate(date).toLocaleString(short ? DateTime.DATE_SHORT : DateTime.DATETIME_FULL)
  }

  static randomElement (array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  static randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static thousands (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export default Util
