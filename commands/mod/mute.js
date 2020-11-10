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
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const duration = yield {
      prompt: {
        start: 'How long should the mute last?',
        retry: 'Please enter a mute duration.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you muting this user?',
        retry: 'Please add a reason for this mute.',
        optional: true
      },
      default: '`No reason given`'
    }

    return { member, duration, reason }
  }

  async exec (message, { member, duration, reason }) {
    if (member.id === message.author.id) {
      return message.channel.send(`${config.emoji.warning} You can't mute yourself.`)
    }

    if (member.id === this.client.user.id) {
      return message.channel.send(`${config.emoji.warning} Nice try, human.`)
    }

    if (member.roles.cache.some(role => role.name === 'Muted')) {
      return message.channel.send(`${config.emoji.warning} That user is already muted.`)
    }

    // const mutedRole = await message.guild.roles.fetch(config.infractions.mutedRole)
    const longDuration = ms(ms(duration), { long: true })

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
      expiration: DateTime.fromMillis(DateTime.local() + ms(duration))
    })

    // Send mod log
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setColor(config.embeds.colors.yellow)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
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
  }
}

export default MuteCommand
