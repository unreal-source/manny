import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import formatDate from '../../utilities/formatDate'
import Case from '../../models/cases'

class UnbanCommand extends Command {
  constructor () {
    super('unban', {
      aliases: ['unban'],
      category: 'Moderator',
      description: {
        name: 'Unban User',
        content: 'Unban a user from the server.',
        usage: '!unban <user> <reason>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const user = yield {
      type: 'user',
      prompt: {
        start: 'Which user do you want to unban?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you unbanning this user?',
        retry: 'Please add a reason for unbanning this user.'
      }
    }

    return { user, reason }
  }

  async exec (message, { user, reason }) {
    if (user.id === message.author.id) {
      return message.channel.send(':warning: You can\'t unban yourself.')
    }

    if (user.id === this.client.user.id) {
      return message.channel.send(':warning: How could I unban myself?')
    }

    if (message.guild.fetchBan(user.id)) {
      // Take action
      await message.guild.members.unban(user, reason)

      // Record case
      const now = DateTime.local()

      await Case.create({
        action: 'unban',
        user: user.id,
        moderator: message.author.id,
        reason: reason,
        timestamp: now
      })

      // Send mod log
      const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setColor(config.embeds.colors.blue)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${config.prefixes.undo} Unbanned ${user.tag}`)
        .setDescription(`**Reason:** ${reason}`)
        .setFooter(formatDate(now))

      return logChannel.send({ embed: logEntry })
    }
  }
}

export default UnbanCommand
