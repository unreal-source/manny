import { log } from '../utilities/logger.js'

export default {
  event: 'rateLimit',
  emitter: 'client',
  async execute (data) {
    return log.warn({ event: 'rate-limit', timeout: data.timeout, limit: data.limit, method: data.method, path: data.path, route: data.route, global: data.global })
  }
}
