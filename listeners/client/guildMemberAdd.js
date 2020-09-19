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
    const channel = this.client.channels.cache.get(config.logs.memberLog)
    const now = DateTime.local()
    const accountCreated = DateTime.fromJSDate(member.user.createdAt)
    const accountAge = now.diff(accountCreated, 'minutes').toObject()

    // Flag bots
    if (member.user.bot) {
      return channel.send(`:robot: <@${member.user.id}> \`BOT\`was added to the server`)
    }

    // Flag new accounts
    if (accountAge.minutes <= config.newAccountThreshold) {
      return channel.send(`:inbox_tray: <@${member.user.id}> \`NEW ACCOUNT\` joined the server`)
    } else {
      return channel.send(`:inbox_tray: <@${member.user.id}> joined the server`)
    }
  }
}

export default GuildMemberAddListener
