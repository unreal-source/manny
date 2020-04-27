import { Listener } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../bot.config'

class GuildMemberAddListener extends Listener {
  constructor () {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd'
    })
  }

  exec (member) {
    const channel = this.client.channels.cache.get(config.logChannels.userLog)

    // Flag bots
    if (member.user.bot) {
      return channel.send(`:robot: <@${member.user.id}> was added to the server.`)
    }

    // Current date and time
    const now = DateTime.local()

    // Date and time when this member joined Discord
    const discordJoinDate = DateTime.fromJSDate(member.user.createdAt)

    // Time since this member joined Discord
    const timeSinceJoin = now.diff(discordJoinDate, 'minutes').toObject()

    if (timeSinceJoin.minutes <= config.newToDiscordThreshold) {
      return channel.send(`:inbox_tray: <@${member.user.id}> joined the server. \`NEW TO DISCORD\``)
    } else {
      return channel.send(`:inbox_tray: <@${member.user.id}> joined the server.`)
    }
  }
}

export default GuildMemberAddListener
