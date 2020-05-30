import { Command } from 'discord-akairo'
import config from '../../bot.config'
import { DateTime } from 'luxon'
import InfractionHistory from '../../models/Infractions'

class UserHistoryCommand extends Command {
  constructor () {
    super('history', {
      aliases: ['history'],
      category: 'Moderation',
      description: {
        name: 'User History',
        content: 'Check a user\'s infraction history.',
        usage: '`!history <user>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const user = yield {
      type: 'user',
      prompt: {
        start: 'Who\'s infraction history do you want to check?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    return { user }
  }

  async exec (message, { user }) {
    const history = await InfractionHistory.findOne({
      where: { user_id: user.id }
    })

    if (history) {
      const embed = this.client.util.embed()
        .setColor(config.embedColors.violet)
        .setThumbnail(user.displayAvatarURL())
        .setTitle(user.username)
        .setDescription(user.bot ? `${user.tag} \`BOT\`` : user.tag)
        .addField('Mutes', 'None')
        .addField('Strikes', 'None')
        .addField('Bans', history.bans.length === 0 ? 'None' : history.bans.map(entry => `**${DateTime.fromISO(entry.date).toLocaleString(DateTime.DATETIME_FULL)}**\n> Banned by \`${entry.executor}\`\n> Reason: ${entry.reason}`).join('\n'))

      return message.channel.send({ embed })
    }

    return message.channel.send(`**${user.tag}** has no infraction history.`)
  }
}

export default UserHistoryCommand
