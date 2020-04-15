import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../quin.config.js'

class UserInfoCommand extends Command {
  constructor () {
    super('user', {
      aliases: ['user'],
      category: 'Utility',
      description: {
        name: 'User Info',
        content: 'Get information about a user.',
        usage: '!user [@username or ID]'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  * args () {
    const member = yield {
      type: 'member',
      default: message => message.member,
      prompt: {
        start: 'Which user do you want to look up?',
        retry: 'User not found. Please enter a valid username or ID.',
        optional: true
      }
    }

    return { member }
  }

  async exec (message, { member }) {
    const discordJoinDate = DateTime.fromISO(member.user.createdAt.toISOString())
    const guildJoinDate = DateTime.fromISO(member.joinedAt.toISOString())

    const status = {
      online: ':green_circle: Online',
      idle: ':orange_circle: Idle',
      dnd: ':red_circle: Do Not Disturb',
      offline: ':black_circle: Offline'
    }

    const embed = this.client.util.embed()
      .setColor(config.embedColors.violet)
      .setThumbnail(member.user.displayAvatarURL())
      .setTitle(member.displayName)
      .setDescription(member.user.bot ? `${member.user.tag} \`BOT\`` : member.user.tag)
      .addField('Status', status[member.presence.status])
      .addField('ID', member.id)
      .addField('Roles', member.roles.cache.map(role => `\`${role.name}\``).join(' '))
      .addField('Joined Server', guildJoinDate.toLocaleString(DateTime.DATE_FULL))
      .addField('Joined Discord', discordJoinDate.toLocaleString(DateTime.DATE_FULL))
    return message.util.send({ embed })
  }
}

export default UserInfoCommand
