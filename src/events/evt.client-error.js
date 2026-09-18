import { log } from 'evlog'

export default {
  event: 'error',
  emitter: 'client',
  execute (error) {
    log.error('client', error)
  }
}
