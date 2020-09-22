import { Listener } from 'discord-akairo'
import config from '../../config'
import ms from 'ms'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.guilds.cache.each(guild => this.client.log.success(`${this.client.user.username} successfully connected to ${guild.name}`))

    this.client.user.setActivity('the server • !help', {
      type: 'WATCHING'
    })

    let oldMemberCount = this.client.guilds.cache.first().memberCount

    setInterval(() => {
      const newMemberCount = this.client.guilds.cache.first().memberCount
      const difference = newMemberCount - oldMemberCount
      const channel = this.client.channels.cache.get(config.automod.notifChannel)

      if (difference >= config.automod.joinCount) {
        channel.send(`Unusual activity detected. ${difference} new ${difference < 2 ? 'member' : 'members'} joined the server in the last 10 seconds.`)
      }

      oldMemberCount = newMemberCount
    }, ms(config.automod.joinInterval))
  }
}

export default ReadyListener
