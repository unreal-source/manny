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
    this.client.user.setActivity('the server', { type: 'WATCHING' })
  }
}

export default ClientReady
