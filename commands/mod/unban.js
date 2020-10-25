import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
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
      return message.channel.send(':warning: You cannot unban yourself.')
    }

    if (user.id === this.client.user.id) {
      return message.channel.send(':warning: Nice try, human.')
    }

    const bans = await message.guild.fetchBans()

    if (!bans.some(ban => ban.user === user)) {
      return message.channel.send(`${user.tag} is not banned.`)
    }

    // Take action
    await message.guild.members.unban(user, reason)

    // Record case
    const record = await Case.create({
      action: 'unban',
      user: user.tag,
      moderator: message.author.tag,
      reason: reason,
      timestamp: DateTime.local()
    })

    // Send mod log
    const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
    const logEntry = this.client.util.embed()
      .setColor(config.embeds.colors.blue)
      .setAuthor(user.tag, user.displayAvatarURL())
      .setTitle(`${config.prefixes.undo} Member unbanned`)
      .setDescription(`by ${message.author.tag}`)
      .addField('Reason', reason)
      .setFooter(`#${record.id}`)
      .setTimestamp()

    return logChannel.send({ embed: logEntry })
  }
}

export default UnbanCommand
