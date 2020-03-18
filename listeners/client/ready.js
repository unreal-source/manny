import { Listener } from 'discord-akairo'
import log from '../../util/logger.js'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    log.success(`${this.client.user.username} successfully connected to ${this.client.guilds.cache.first().name}. All systems operational.`)
  }
}

export default ReadyListener
