import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
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
      clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
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
        retry: 'Please add a reason for this ban.',
        optional: true
      },
      default: '`No reason given`'
    }

    return { user, reason }
  }

  async exec (message, { user, reason }) {
    try {
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
        .addField('Appeals', `If you would like to appeal this decision, [fill out this form](${config.meta.links.appeals}) and we will get back to you as soon as possible.`)
      await user.send({ embed: receipt })

      // Take action
      await message.guild.members.ban(user, { reason: reason })

      // Record case
      const record = await Case.create({
        action: 'ban',
        user: user.tag,
        userID: user.id,
        moderator: message.author.tag,
        moderatorID: message.author.id,
        reason: reason,
        timestamp: DateTime.local()
      })

      // Send mod log
      const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setColor(config.embeds.colors.red)
        .setAuthor(user.tag, user.displayAvatarURL())
        .setTitle(`${config.prefixes.ban} Member banned`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      return logChannel.send({ embed: logEntry })
    } catch (err) {
      return this.client.log.error(err)
    }
  }
}

export default BanCommand
