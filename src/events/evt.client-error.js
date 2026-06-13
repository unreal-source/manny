import { log } from '../utilities/logger.js'

export default {
  event: 'error',
  emitter: 'client',
  async execute (error) {
    return log.error({ event: 'client-error', error })
  }
}
