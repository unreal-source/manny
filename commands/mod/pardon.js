import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'

class PardonCommand extends Command {
  constructor () {
    super('pardon', {
      aliases: ['pardon'],
      category: 'Moderator',
      description: {
        name: 'Pardon',
        short: 'Remove a strike from a user.',
        long: 'Remove a strike from a user. This action is recorded in the mod log.',
        syntax: '!pardon case reason',
        args: {
          case: 'The case number for the strike you want to remove.',
          reason: 'The reason this strike is being removed.'
        }
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const infraction = yield {
      type: 'infraction',
      prompt: {
        start: 'Enter the case number for the strike you want to pardon.',
        retry: 'Case not found. Please enter a valid case number.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you removing this strike?'
      }
    }

    return { infraction, reason }
  }

  async exec (message, { infraction, reason }) {
    // Record case
    const record = await Case.create({
      action: 'pardon',
      user: infraction.user,
      userID: infraction.userID,
      moderator: message.author.tag,
      moderatorID: message.author.id,
      reason: reason,
      timestamp: DateTime.local()
    })

    // Remove strike from schedule
    await Strike.destroy({
      where: { id: infraction.id }
    })

    await Case.update({ active: false }, {
      where: { id: infraction.id }
    })

    // If member is muted, unmute and remove mute from schedule
    const member = await message.guild.member(record.userID)

    if (member.roles.cache.some(role => role.name === 'Muted')) {
      const muteRole = await message.guild.roles.fetch(config.infractions.muteRole)
      await member.roles.remove(muteRole)

      await Mute.destroy({
        where: { id: member.id }
      })
    }

    // Send mod log
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setColor(config.embeds.colors.orange)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${config.prefixes.undo} Strike removed`)
      .setDescription(`by ${message.author.tag}`)
      .addField('Reason', reason)
      .setFooter(`#${record.id}`)
      .setTimestamp()

    await logChannel.send({ embed: logEntry })

    // Send receipt
    const receipt = this.client.util.embed()
      .setColor(config.embeds.colors.orange)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`${config.prefixes.undo} One of your strikes was removed`)
      .addField('Reason', reason)
      .setFooter(`#${record.id}`)
      .setTimestamp()

    return member.send({ embed: receipt })
  }
}

export default PardonCommand
