import { Listener } from 'discord-akairo'
import config from '../../config'

class GuildMemberRemoveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove'
    })
  }

  exec (member) {
    if (member.deleted) {
      return
    }

    const channel = this.client.channels.cache.get(config.logs.memberLog)

    if (member.user.bot) {
      return channel.send(`:robot: __**${member.user.tag}**__ was removed from the server \`BOT\``)
    }

    return channel.send(`:outbox_tray: __**${member.user.tag}**__ left the server`)
  }
}

export default GuildMemberRemoveListener
