import { log } from '../utilities/logger.js'

export default {
  event: 'warn',
  emitter: 'client',
  async execute (info) {
    return log.warn({ event: 'client-warn' }, info)
  }
}
