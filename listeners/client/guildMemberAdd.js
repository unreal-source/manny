import { Listener } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'

class GuildMemberAddListener extends Listener {
  constructor () {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd'
    })
  }

  exec (member) {
    const channel = this.client.channels.cache.get(config.channels.logs.memberLog)
    const now = DateTime.local()
    const accountCreated = DateTime.fromJSDate(member.user.createdAt)
    const accountAge = now.diff(accountCreated, 'minutes').toObject()

    // Flag bots
    if (member.user.bot) {
      return channel.send(`:robot: <@${member.user.id}> was added to the server \`BOT\``)
    }

    // Flag new accounts
    if (accountAge.minutes <= config.automod.newAccountAge) {
      return channel.send(`:inbox_tray: <@${member.user.id}> joined the server \`NEW\``)
    }

    return channel.send(`:inbox_tray: <@${member.user.id}> joined the server`)
  }
}

export default GuildMemberAddListener
