import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import formatDate from '../../utilities/formatDate'
import Case from '../../models/cases'

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      category: 'Moderator',
      description: {
        name: 'Ban User',
        content: 'Ban a user from the server',
        usage: '!ban <user> <reason>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const user = yield {
      type: 'user',
      prompt: {
        start: 'Which user do you want to ban?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you banning this user?',
        retry: 'Please add a reason for this ban.'
      }
    }

    return { user, reason }
  }

  async exec (message, { user, reason }) {
    if (user.id === message.author.id) {
      return message.channel.send(`${config.emoji.warning} Why would you ban yourself?`)
    }

    if (user.id === this.client.user.id) {
      return message.channel.send(`${config.emoji.warning} Nice try, human.`)
    }

    // If user is a guild member, make sure we have permission to ban them
    if (message.guild.members.cache.some(member => member.user.id === user.id)) {
      const member = await message.guild.members.fetch(user)

      if (member.roles.highest.position >= message.member.roles.highest.position) {
        return message.channel.send('You cannot ban this user.')
      }

      if (!member.bannable) {
        return message.channel.send('I am unable to ban this user.')
      }
    }

    // Send receipt (This must be done first here because we can't send a DM after they're banned)
    const receipt = this.client.util.embed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`${config.prefixes.ban} You were banned from the server`)
      .addField('Reason', reason)
      .addField('Appeals', 'If you would like to appeal this decision, [fill out this form]() and we will get back to you as soon as possible.')
    // TODO: Add link to appeals form
    await user.send({ embed: receipt })

    // Take action
    await message.guild.members.ban(user, { reason: reason })

    // Record case
    const now = DateTime.local()

    await Case.create({
      action: 'ban',
      user: user.tag,
      moderator: message.author.tag,
      reason: reason,
      timestamp: now
    })

    // Send mod log
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setColor(config.embeds.colors.red)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .setTitle(`${config.prefixes.ban} Banned ${user.tag}`)
      .setDescription(`**Reason:** ${reason}`)
      .setFooter(formatDate(now))

    return logChannel.send({ embed: logEntry })
  }
}

export default BanCommand
