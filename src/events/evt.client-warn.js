import { log } from 'evlog'

export default {
  event: 'warn',
  emitter: 'client',
  execute (info) {
    log.warn('client', info)
  }
}
