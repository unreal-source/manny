import { Listener } from 'discord-akairo'
import log from '../../util/logger.js'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      eventName: 'ready'
    })
  }

  async exec () {
    // Log connection state
    log.success(`${this.client.user.username} successfully connected to ${this.client.guilds.first().name}. All systems operational.`)
  }
}

export default ReadyListener
