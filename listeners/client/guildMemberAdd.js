import { Listener } from 'discord-akairo'
import { DateTime } from 'luxon'
import log from '../../util/logger.js'

class GuildMemberAddListener extends Listener {
  constructor () {
    super('guildMemberAdd', {
      emitter: 'client',
      eventName: 'guildMemberAdd'
    })
  }

  async exec (member) {
    try {
      // Get the server log channel
      const channel = this.client.channels.find(c => c.name === this.client.config.serverLogChannel)

      // Initialize log message
      let message = `:inbox_tray: <@${member.user.id}> joined the server.`

      // Current date and time
      const now = DateTime.local()

      // Date and time when this member joined Discord
      const discordJoinDate = DateTime.fromJSDate(member.user.createdAt)

      // Time since this member joined Discord
      const timeSinceJoin = now.diff(discordJoinDate, 'minutes').toObject()

      // Check if the member joined Discord in the last 15 minutes
      if (timeSinceJoin.minutes <= 15) {
        message+= ' :sparkles: `NEW TO DISCORD`'
      }

      // Check if the member is a bot
      if (member.user.bot) {
        message+= ' :robot: `BOT`'
      }

      return channel.send(message)
    } catch (error) {
      log.error(error)
    }
  }
}

export default GuildMemberAddListener
