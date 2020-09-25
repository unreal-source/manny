import { Listener } from 'discord-akairo'
import config from '../../config'
import Case from '../../models/cases'
import formatDate from '../../utilities/formatDate'

class GuildBanAddListener extends Listener {
  constructor () {
    super('guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd'
    })
  }

  async exec (guild, user) {
    try {
      const auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
      const entry = auditLogs.entries.first()

      // If the user was banned with a bot command, logging via this event will show the bot as the executor.
      // Since we always want the executor to be the moderator who took the action, we skip logging here
      // and let the command handle it.
      if (entry.executor.id === this.client.user.id) {
        return
      }

      // Record case
      await Case.create({
        action: 'ban',
        user: user.id,
        moderator: entry.executor.id,
        reason: entry.reason,
        timestamp: entry.createdAt
      })

      // Send mod log
      const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setColor(config.embeds.colors.red)
        .setAuthor(entry.executor.tag, entry.executor.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${config.prefixes.ban} Banned ${user.tag}`)
        .setDescription(`**Reason:** ${entry.reason}`)
        .setFooter(formatDate(entry.createdAt))

      return logChannel.send({ embed: logEntry })
    } catch (err) {
      this.client.log.error(err)
    }
  }
}

export default GuildBanAddListener
