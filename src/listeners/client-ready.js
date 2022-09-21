import { Listener } from 'hiei.js'
import log from '../utilities/logger.js'

class ClientReady extends Listener {
  constructor () {
    super({
      name: 'ClientReady',
      emitter: 'client',
      event: 'ready',
      once: true
    })
  }

  run (client) {
    client.guilds.cache.each(guild => log.info({ event: 'client-ready', guild: guild.name }, `${client.user.username} connected to ${guild.name}`))
  }
}

export default ClientReady
