import { Listener } from 'hiei.js'
import log from '../utilities/logger.js'

class ClientWarn extends Listener {
  constructor () {
    super({
      name: 'ClientWarn',
      emitter: 'client',
      event: 'warn'
    })
  }

  run (info) {
    return log.warn({ event: 'client-warn' }, info)
  }
}

export default ClientWarn
