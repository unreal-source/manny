import { DateTime } from 'luxon'

class Util {
  static capitalize (str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  static color (color) {
    const colors = {
      red: '#f03e3e',
      orange: '#fd7e14',
      yellow: '#ffe066',
      green: '#69db7c',
      cyan: '#66d9e8',
      blue: '#4dabf7',
      violet: '#9775fa',
      pink: '#faa2c1'
    }

    return colors[color]
  }

  static delay (duration) {
    return new Promise(resolve => {
      setTimeout(resolve, duration)
    })
  }

  static prefix (prefix) {
    const prefixes = {
      archive: ':card_box:',
      ban: ':no_entry_sign:',
      bot: ':robot:',
      edit: ':pencil:',
      error: ':x:',
      expired: ':alarm_clock:',
      info: ':mag_right:',
      join: ':inbox_tray:',
      leave: ':outbox_tray:',
      lock: ':lock:',
      moderator: ':shield:',
      mute: ':clock2:',
      purge: ':broom:',
      strike: ':triangular_flag_on_post:',
      success: ':white_check_mark:',
      undo: ':arrow_right_hook:',
      unlock: ':unlock:',
      warning: ':warning:'
    }

    return prefixes[prefix]
  }

  static prettyDate (date, short = false) {
    return DateTime.fromJSDate(date).toLocaleString(short ? DateTime.DATE_SHORT : DateTime.DATETIME_FULL)
  }

  static prettyStrikeExpiration (date) {
    return DateTime.fromJSDate(date).plus({ days: 30 }).toLocaleString(DateTime.DATETIME_FULL)
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
