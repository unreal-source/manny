import { Command, Flag } from 'discord-akairo'
import Case from '../../models/cases'
import config from '../../config'
import { DateTime } from 'luxon'

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
        ban: `${config.prefixes.ban} Member banned`,
        unban: `${config.prefixes.undo} Member unbanned`,
        mute: `${config.prefixes.mute} Member muted for ${record.duration}`,
        unmute: `${config.prefixes.undo} Member unmuted`,
        strike: `${config.prefixes.strike} Strike added`,
        pardon: `${config.prefixes.undo} Strike removed`
      }

      const border = {
        mute: config.embeds.colors.yellow,
        unmute: config.embeds.colors.yellow,
        strike: config.embeds.colors.orange,
        pardon: config.embeds.colors.orange,
        ban: config.embeds.colors.red,
        unban: config.embeds.colors.red
      }

      const embed = this.client.util.embed()
        .setColor(border[record.action])
        .setAuthor(record.user)
        .setTitle(title[record.action])
        .setDescription(`by ${record.moderator}`)
        .addField('Reason', record.reason)
        .setFooter(`#${record.id} • ${record.timestamp.toLocaleString(DateTime.DATETIME_FULL)}`)

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
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setColor(config.embeds.colors.blue)
      .setTitle(`${config.prefixes.edit} Reason edited for case #${infraction}`)
      .setDescription(`by ${message.author.tag}`)
      .addField('Old Reason', record.reason)
      .addField('New Reason', reason)
      .setTimestamp()

    return logChannel.send({ embed: logEntry })
  }
}

export default ReasonCommand
