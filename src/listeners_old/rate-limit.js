import { Listener } from 'hiei.js'
import log from '../utilities/logger.js'

class RateLimit extends Listener {
  constructor () {
    super({
      name: 'RateLimit',
      emitter: 'client',
      event: 'rateLimit'
    })
  }

  run (data) {
    return log.warn({ event: 'rate-limit', timeout: data.timeout, limit: data.limit, method: data.method, path: data.path, route: data.route, global: data.global })
  }
}

export default RateLimit
