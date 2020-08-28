import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../bot.config'
import formatDate from '../../utilities/formatDate'
import InfractionHistory from '../../models/Infractions'

class UnbanCommand extends Command {
  constructor () {
    super('unban', {
      aliases: ['unban'],
      category: 'Moderation',
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
      await message.guild.members.unban(user, reason)
      message.channel.send(`You unbanned ${user} from the server.`)
    }

    const now = DateTime.local().toISO()
    const unban = {
      action: 'unban',
      date: now,
      executor: message.author.tag,
      reason: reason
    }

    const history = await InfractionHistory.findOne({
      where: { user_id: user.id }
    })

    if (history) {
      const bans = history.bans
      bans.push(unban)
      await InfractionHistory.update({
        bans: bans
      }, {
        where: { user_id: user.id }
      })
    }

    const logChannel = this.client.channels.cache.get(config.logs.modLog)
    const embed = this.client.util.embed()
      .setColor(config.embedColors.red)
      .setTitle(`${config.emoji.undo} __${user.tag}__ was unbanned by __${message.author.tag}__`)
      .setDescription(`Reason: ${reason}`)
      .setFooter(formatDate(now))

    return logChannel.send({ embed })
  }
}

export default UnbanCommand
