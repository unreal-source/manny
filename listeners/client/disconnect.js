import { Listener } from 'discord-akairo'
import log from '../../util/logger.js'

class DisconnectListener extends Listener {
  constructor () {
    super('disconnect', {
      emitter: 'client',
      event: 'disconnect'
    })
  }

  async exec () {
    // Log connection state
    log.info(`${this.client.user.username} disconnected from ${this.client.guilds.cache.first().name}.`)
  }
}

export default DisconnectListener
