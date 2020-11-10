import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class UserInfoCommand extends Command {
  constructor () {
    super('user', {
      aliases: ['user'],
      category: 'Info',
      description: {
        name: 'User Info',
        short: 'Get information about a user.',
        syntax: '!user user',
        args: {
          user: 'The user you want to learn about. Can be a name, mention, or ID.'
        }
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
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
      .setTitle(member.user.bot ? `**${member.user.tag}** \`BOT\`` : `**${member.user.tag}**`)
      .setThumbnail(member.user.displayAvatarURL())
      .addField('Status', status[member.presence.status], true)
      .addField('ID', member.id, true)
      .addField('Roles', member.roles.cache.map(role => `\`${role.name}\``).join(' '))
      .addField('Joined Server', _.prettyDate(member.joinedAt))
      .addField('Joined Discord', _.prettyDate(member.user.createdAt))
    return message.util.send({ embed })
  }
}

export default UserInfoCommand
