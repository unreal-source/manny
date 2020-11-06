import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class CapsCommand extends Command {
  constructor () {
    super('caps', {
      aliases: ['caps'],
      category: 'Info',
      description: {
        name: 'Server Caps',
        content: 'Get the member caps for this server',
        usage: '!caps'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async exec (message) {
    const guild = await message.guild.fetch()
    const embed = this.client.util.embed()
      .setTitle('Server Caps')
      .addField('Max Members', _.thousands(guild.maximumMembers))
      .addField('Max Online Members', _.thousands(guild.maximumPresences))

    return message.util.send({ embed })
  }
}

export default CapsCommand
