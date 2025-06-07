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

  async run (client) {
    const guild = await this.client.guilds.fetch(process.env.GUILD)

    log.info({ event: 'client-ready', guild: guild.name }, `${client.user.username} connected to ${guild.name}`)
  }
}

export default ClientReady
