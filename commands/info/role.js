import { Command } from 'discord-akairo'
import config from '../../config'
import _ from '../../utilities/Util'

class RoleInfoCommand extends Command {
  constructor () {
    super('role', {
      aliases: ['role'],
      category: 'Info',
      description: {
        name: 'Role Info',
        content: 'Get information about a role',
        usage: '!role <@role or ID>'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  * args () {
    const role = yield {
      type: 'role',
      prompt: {
        start: 'Which role do you want to look up?',
        retry: 'Role not found. Please enter a valid role name or ID.'
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
