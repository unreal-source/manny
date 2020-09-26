import { Command, Flag } from 'discord-akairo'
import Case from '../../models/cases'
import config from '../../config'
import { DateTime } from 'luxon'
import formatDate from '../../utilities/formatDate'

class ReasonCommand extends Command {
  constructor () {
    super('reason', {
      aliases: ['reason'],
      category: 'Moderator',
      description: {
        name: 'Edit Reason',
        content: 'Edit the reason for an infraction',
        usage: '!reason <infraction> <new reason>'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async * args (message) {
    const infraction = yield {
      type: 'integer',
      prompt: {
        start: 'Enter the case number for the infraction you want to edit.'
      }
    }

    const record = await Case.findOne({
      where: { id: infraction }
    })

    if (record) {
      const title = {
        ban: `${config.prefixes.ban} Banned ${record.user}`,
        unban: `${config.prefixes.undo} Unbanned ${record.user}`,
        mute: `Muted ${record.user} for ${record.duration}`,
        unmute: `Unmuted ${record.user}`,
        strike: `Gave ${record.user} a strike`,
        pardon: `Removed a strike from ${record.user}`
      }

      // TODO: Fetch images if they're available
      const embed = this.client.util.embed()
        .setAuthor(record.moderator)
        .setTitle(title[record.action])
        .addField('Reason', record.reason)
        .setFooter(`#${infraction} • ${formatDate(record.timestamp, { sql: true })}`)

      await message.channel.send(embed)
    } else {
      await message.channel.send('Case not found.')
      return Flag.cancel()
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Add a new reason.'
      }
    }

    return { record, infraction, reason }
  }

  async exec (message, { record, infraction, reason }) {
    // Update record
    await Case.update({
      reason: reason
    }, {
      where: { id: infraction }
    })

    await message.channel.send(`Reason for Infraction #${infraction} updated.`)

    // Send mod log
    const now = DateTime.local()
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`${config.prefixes.edit} Edited reason for #${infraction}`)
      .addField('Old Reason', record.reason)
      .addField('New Reason', reason)
      .setFooter(formatDate(now))

    return logChannel.send({ embed: logEntry })
  }
}

export default ReasonCommand
