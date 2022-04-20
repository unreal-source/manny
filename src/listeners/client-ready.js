import { Listener } from 'hiei.js'

class ClientReady extends Listener {
  constructor () {
    super({
      name: 'ClientReady',
      emitter: 'client',
      event: 'ready',
      once: true
    })
  }

  run () {
    this.client.guilds.cache.each(guild => console.log(`${this.client.user.username} connected to ${guild.name}`))
  }
}

export default ClientReady
