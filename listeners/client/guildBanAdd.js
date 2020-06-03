import { Listener } from 'discord-akairo'
import config from '../../bot.config'
import InfractionHistory from '../../models/Infractions'

class GuildBanAddListener extends Listener {
  constructor () {
    super('guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd'
    })
  }

  async exec (guild, user) {
    const channel = this.client.channels.cache.get(config.logs.modLog)
    const auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
    const entry = auditLogs.entries.first()

    // If the user was banned with a bot command, logging via this event will show the bot as the executor.
    // We always want the executor to be the moderator who took the action, so if a command was used, we skip logging here
    // and let the command handle it.
    if (entry.executor.id === this.client.user.id) {
      return
    }

    const ban = {
      action: 'ban',
      date: entry.createdAt,
      executor: entry.executor.tag,
      reason: entry.reason
    }

    const history = await InfractionHistory.findOne({
      where: { user_id: user.id }
    })

    if (history) {
      const bans = history.bans
      bans.push(ban)
      await InfractionHistory.update({
        bans: bans
      }, {
        where: { user_id: user.id }
      })
    } else {
      await InfractionHistory.create({
        user_id: user.id,
        mutes: [],
        strikes: [],
        bans: [ban]
      })
    }

    return channel.send(`:no_entry_sign: **${user.tag}** was banned by **${ban.executor}**. Reason: ${ban.reason}`)
  }
}

export default GuildBanAddListener
