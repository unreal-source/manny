import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class RoleInfoCommand extends Command {
  constructor () {
    super('role', {
      aliases: ['role'],
      category: 'Info',
      description: {
        name: 'Role Info',
        short: 'Get information about a role.',
        syntax: '!role role',
        args: {
          role: 'The role you want to learn about. Can be a name, mention, or ID.'
        }
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
    })
  }

  * args () {
    const role = yield {
      type: 'role',
      prompt: {
        start: 'Which role do you want to learn about?',
        retry: 'Role not found. Please enter a role name, mention, or ID.'
      }
    }

    return { role }
  }

  exec (message, { role }) {
    const embed = this.client.util.embed()
      .setColor(role.hexColor)
      .setTitle(`**${role.name}**`)
      .addField('Color', role.hexColor, true)
      .addField('ID', role.id, true)
      .addField('Members', role.members.size)
      .addField('Mentionable', role.mentionable)
      .addField('Created', _.prettyDate(role.createdAt))

    return message.util.send({ embed })
  }
}

export default RoleInfoCommand
