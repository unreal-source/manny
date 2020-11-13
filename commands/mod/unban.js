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
        short: 'Unban a user from the server.',
        long: 'Unban a user from the server. This action is recorded in the mod log.',
        syntax: '!unban user reason',
        args: {
          user: 'The user you want to unban. Can be a name, mention, or ID.',
          reason: 'The reason this user is being unbanned.'
        }
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
        start: 'Which user do you want to unban?',
        retry: 'User not found. Please enter a name, mention, or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      default: '`No reason given`'
    }

    return { user, reason }
  }

  async exec (message, { user, reason }) {
    try {
      if (user.id === message.author.id) {
        return message.util.send(`${config.prefixes.warning} You cannot unban yourself.`)
      }

      if (user.id === this.client.user.id) {
        return message.util.send(`${config.prefixes.warning} Nice try, human.`)
      }

      const bans = await message.guild.fetchBans()

      if (!bans.some(ban => ban.user === user)) {
        return message.util.send(`**${user.tag}** is not banned.`)
      }

      // Take action
      await message.guild.members.unban(user, reason)

      // Record case
      const record = await Case.create({
        action: 'unban',
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
        .setColor(config.embeds.colors.blue)
        .setAuthor(user.tag)
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${config.prefixes.undo} Member unbanned`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      await logChannel.send({ embed: logEntry })
      return message.util.send(`${config.prefixes.undo} **${user.tag}** was unbanned.`)
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default UnbanCommand
