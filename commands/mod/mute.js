import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import ms from 'ms'

class MuteCommand extends Command {
  constructor () {
    super('mute', {
      aliases: ['mute'],
      category: 'Moderator',
      description: {
        name: 'Mute User',
        short: 'Temporarily restrict a user\'s ability to send messages.',
        long: 'Temporarily restrict a user\'s ability to send messages. This action is recorded in the mod log.',
        syntax: '!mute user duration reason',
        args: {
          user: 'The user you want to mute. Can be a name, mention, or ID.',
          duration: 'How long the mute should last.',
          reason: 'The reason this user is being muted.'
        }
      },
      channel: 'guild',
      clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const member = yield {
      type: 'member',
      prompt: {
        start: 'Which user do you want to mute?',
        retry: 'User not found. Please enter a name, mention, or ID.'
      }
    }

    const duration = yield {
      type: 'duration',
      prompt: {
        start: 'For how long?',
        retry: 'Please enter a duration. Examples: 10m, 10 mins, 10 minutes'
      }
    }

    const reason = yield {
      match: 'rest',
      default: '`No reason given`'
    }

    return { member, duration, reason }
  }

  async exec (message, { member, duration, reason }) {
    try {
      if (member.id === message.author.id) {
        return message.util.send(`${config.prefixes.warning} You can't mute yourself.`)
      }

      if (member.id === this.client.user.id) {
        return message.util.send(`${config.prefixes.warning} Nice try, human.`)
      }

      if (member.roles.cache.some(role => role.name === 'Muted')) {
        return message.util.send(`${config.prefixes.warning} That user is already muted.`)
      }

      const longDuration = ms(duration, { long: true })

      // Take action
      await member.roles.add(config.infractions.muteRole)

      // Record case
      const record = await Case.create({
        action: 'mute',
        user: member.user.tag,
        userID: member.id,
        moderator: message.author.tag,
        moderatorID: message.author.id,
        reason: reason,
        duration: longDuration,
        timestamp: DateTime.local()
      })

      // Add to mute schedule
      await Mute.create({
        id: member.id,
        expiration: DateTime.fromMillis(DateTime.local() + duration)
      })

      // Send mod log
      const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setColor(config.embeds.colors.yellow)
        .setAuthor(member.user.tag)
        .setThumbnail(member.user.displayAvatarURL())
        .setTitle(`${config.prefixes.mute} Member muted for ${longDuration}`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      await logChannel.send({ embed: logEntry })

      // Send receipt
      const receipt = this.client.util.embed()
        .setColor(config.embeds.colors.yellow)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`${config.prefixes.mute} You were muted for ${longDuration}`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      return member.send({ embed: receipt })
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default MuteCommand
