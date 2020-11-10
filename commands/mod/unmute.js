import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import Case from '../../models/cases'
import Mute from '../../models/mutes'

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
      category: 'Moderator',
      description: {
        name: 'Unmute User',
        short: 'Restore a muted user\'s ability to send messages.',
        long: 'Restore a muted user\'s ability to send messages. This action is recorded in the mod log.',
        syntax: '!unmute user reason',
        args: {
          user: 'The user you want to unmute. Can be a name, mention, or ID.',
          reason: 'The reason this user is being unmuted.'
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
        start: 'Which user do you want to unmute?',
        retry: 'User not found. Please enter a name, mention, or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      default: '`No reason given`'
    }

    return { member, reason }
  }

  async exec (message, { member, reason }) {
    if (member.id === message.author.id) {
      return message.channel.send(`${config.emoji.warning} You can't unmute yourself.`)
    }

    if (member.id === this.client.user.id) {
      return message.channel.send(`${config.emoji.warning} Nice try, human.`)
    }

    if (!member.roles.cache.some(role => role.name === 'Muted')) {
      return message.channel.send(`${config.emoji.warning} That user is not muted.`)
    }

    const muteRole = await message.guild.roles.fetch(config.infractions.muteRole)

    // Take action
    await member.roles.remove(muteRole)

    // Record case
    const record = await Case.create({
      action: 'unmute',
      user: member.user.tag,
      userID: member.id,
      moderator: message.author.tag,
      moderatorID: message.author.id,
      reason: reason,
      timestamp: DateTime.local()
    })

    // Remove from mute schedule
    await Mute.destroy({
      where: {
        id: member.id
      }
    })

    // Send mod log
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setColor(config.embeds.colors.yellow)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${config.prefixes.undo} Member unmuted`)
      .setDescription(`by ${message.author.tag}`)
      .addField('Reason', reason)
      .setFooter(`#${record.id}`)
      .setTimestamp()

    await logChannel.send({ embed: logEntry })

    // Send receipt
    const receipt = this.client.util.embed()
      .setColor(config.embeds.colors.yellow)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`${config.prefixes.undo} You were unmuted`)
      .addField('Reason', reason)
      .setFooter(`#${record.id}`)
      .setTimestamp()

    return member.send({ embed: receipt })
  }
}

export default UnmuteCommand
