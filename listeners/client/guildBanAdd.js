import { Listener } from 'discord-akairo'
import config from '../../config'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'
import _ from '../../utilities/Util'

class GuildBanAddListener extends Listener {
  constructor () {
    super('guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd'
    })
  }

  async exec (guild, user) {
    try {
      // Remove this user from the mute and strike schedules
      await Mute.destroy({
        where: { id: user.id }
      })

      await Strike.destroy({
        where: { userID: user.id }
      })

      await _.delay(1000)
      const auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
      const entry = auditLogs.entries.first()
      this.client.log.warn('User banned without bot. Audit log retreived:', entry)

      // If the user was banned with a bot command, logging via this event will show the bot as the executor.
      // Since we always want the executor to be the moderator who took the action, we skip logging here
      // and let the command handle it.
      if (entry.executor.id === this.client.user.id) {
        return
      }

      // Record case
      await Case.create({
        action: 'ban',
        user: user.tag,
        userID: user.id,
        moderator: entry.executor.tag,
        moderatorID: entry.executor.id,
        reason: entry.reason,
        timestamp: entry.createdAt
      })

      // Send mod log
      const logChannel = this.client.channels.cache.get(config.channels.logs.modLog)
      const logEntry = this.client.util.embed()
        .setColor(_.color('red'))
        .setAuthor(user.tag)
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${_.prefix('ban')} Member banned`)
        .setDescription(`by ${entry.executor.tag}`)
        .addField('Reason', entry.reason)
        .setTimestamp()

      return logChannel.send({ embed: logEntry })
    } catch (e) {
      return this.client.log.error(e)
    }
  }
}

export default GuildBanAddListener
