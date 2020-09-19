import { Command } from 'discord-akairo'
import config from '../../config'
import InfractionHistory from '../../models/Infractions'
import formatDate from '../../utilities/formatDate'

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
        .setThumbnail(user.displayAvatarURL())
        .setTitle('Infraction History')
        .setDescription(user.bot ? `${user.tag} \`BOT\`` : user.tag)
        .addField('Mutes', history.mutes.length === 0 ? 'None' : history.mutes.map((mute, index) => {
          const timestamp = formatDate(mute.date)
          let content = ''

          switch (mute.action) {
            case 'mute':
              content += `${config.emoji.mute} **Muted for ${mute.duration} by __${mute.executor}__**\nReason: ${mute.reason}\n${timestamp}`
              break
            case 'unmute':
              content += `${config.emoji.undo} **Unmuted by __${mute.executor}__**\nReason: ${mute.reason}\n${timestamp}`
          }

          if (index !== history.mutes.length - 1) {
            content += '\n'
          }

          return content
        }).join('\n'))
        .addField('Strikes', history.strikes.length === 0 ? 'None' : history.strikes.map((strike, index) => {
          const timestamp = formatDate(strike.date)
          let content = ''

          switch (strike.action) {
            case 'strike':
              content += `${config.emoji.strike} **Strike given by __${strike.executor}__**\nReason: ${strike.reason}\n${timestamp}`
              break
            case 'pardon':
              content += `${config.emoji.undo} **Strike removed by __${strike.executor}__**\nReason: ${strike.reason}\n${timestamp}`
          }

          if (index !== history.strikes.length - 1) {
            content += '\n'
          }

          return content
        }).join('\n'))
        .addField('Bans', history.bans.length === 0 ? 'None' : history.bans.map((ban, index) => {
          const timestamp = formatDate(ban.date)
          let content = ''

          switch (ban.action) {
            case 'ban':
              content += `${config.emoji.ban} **Banned by __${ban.executor}__**\nReason: ${ban.reason}\n${timestamp}`
              break
            case 'unban':
              content += `${config.emoji.undo} **Unbanned by __${ban.executor}__**\nReason: ${ban.reason}\n${timestamp}`
              break
          }

          if (index !== history.bans.length - 1) {
            content += '\n'
          }

          return content
        }).join('\n'))

      return message.channel.send({ embed })
    }

    return message.channel.send(`**${user.tag}** has no infraction history.`)
  }
}

export default UserHistoryCommand
