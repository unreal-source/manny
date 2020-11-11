import { Command, Flag } from 'discord-akairo'
import Case from '../../models/cases'
import config from '../../config'
import _ from '../../utilities/Util'

class ReasonCommand extends Command {
  constructor () {
    super('reason', {
      aliases: ['reason'],
      category: 'Moderator',
      description: {
        name: 'Edit Reason',
        short: 'Edit the reason for an infraction.',
        long: 'Edit the reason for an infraction. This action is recorded in the mod log.',
        syntax: '!reason case reason',
        args: {
          case: 'The case number for the infraction you want to update.',
          reason: 'The new reason you want to add.'
        }
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async * args (message) {
    const infraction = yield {
      type: 'infraction',
      prompt: {
        start: 'What\'s the case number for the infraction you want to update?',
        retry: 'Case not found. Please enter the case number found at the bottom of the log entry.'
      }
    }

    const title = {
      ban: `${config.prefixes.ban} Member banned`,
      unban: `${config.prefixes.undo} Member unbanned`,
      mute: `${config.prefixes.mute} Member muted for ${infraction.duration}`,
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
      .setColor(border[infraction.action])
      .setAuthor(infraction.user)
      .setTitle(title[infraction.action])
      .setDescription(`by ${infraction.moderator}`)
      .addField('Reason', infraction.reason)
      .setFooter(`#${infraction.id} • ${_.prettyDate(infraction.timestamp, true)}`)

    await message.util.send(embed)

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Add a new reason.'
      }
    }

    return { infraction, reason }
  }

  async exec (message, { infraction, reason }) {
    try {
      // Update record
      await Case.update({
        reason: reason
      }, {
        where: { id: infraction.id }
      })

      await message.util.send(`Reason for case #${infraction.id} updated.`)

      // Send mod log
      const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setColor(config.embeds.colors.blue)
        .setTitle(`${config.prefixes.edit} Reason edited for case #${infraction.id}`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Old Reason', infraction.reason)
        .addField('New Reason', reason)
        .setTimestamp()

      return logChannel.send({ embed: logEntry })
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default ReasonCommand
