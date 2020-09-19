import { Listener } from 'discord-akairo'
import config from '../../config'
import log from '../../utilities/logger'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.user.setActivity('the server • !help', {
      type: 'WATCHING'
    })

    log.success(`${this.client.user.username} successfully connected to ${this.client.guilds.cache.first().name}. All systems operational.`)

    let oldMemberCount = this.client.guilds.cache.first().memberCount

    setInterval(() => {
      const newMemberCount = this.client.guilds.cache.first().memberCount
      const difference = newMemberCount - oldMemberCount
      const channel = this.client.channels.cache.get(config.shield.alertChannel)

      if (difference >= config.shield.joinCount) {
        channel.send(`Unusual activity detected. ${difference} new ${difference < 2 ? 'member' : 'members'} joined the server in the last 10 seconds.`)
      }

      oldMemberCount = newMemberCount
    }, config.shield.joinDuration)
  }
}

export default ReadyListener
