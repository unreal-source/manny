import { Command } from 'discord-akairo'
import config from '../../config'
import formatDate from '../../utilities/formatDate'

class UserInfoCommand extends Command {
  constructor () {
    super('user', {
      aliases: ['user'],
      category: 'Info',
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
    const status = {
      online: ':green_circle: Online',
      idle: ':orange_circle: Idle',
      dnd: ':red_circle: Do Not Disturb',
      offline: ':black_circle: Offline'
    }

    const embed = this.client.util.embed()
      .setThumbnail(member.user.displayAvatarURL())
      .setTitle(`${config.prefixes.info} User Info`)
      .setDescription(member.user.bot ? `${member.user.tag} \`BOT\`` : member.user.tag)
      .addField('Status', status[member.presence.status], true)
      .addField('ID', member.id, true)
      .addField('Roles', member.roles.cache.map(role => `\`${role.name}\``).join(' '))
      .addField('Joined Server', formatDate(member.joinedAt))
      .addField('Joined Discord', formatDate(member.user.createdAt))
    return message.util.send({ embed })
  }
}

export default UserInfoCommand
