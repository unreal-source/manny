import { Command } from 'discord-akairo'
import commalize from '../../utilities/commalize'

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
      userPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    const guild = await message.guild.fetch()
    const embed = this.client.util.embed()
      .setTitle('Server Caps')
      .addField('Max Members', commalize(guild.maximumMembers.toString()))
      .addField('Max Online Members', commalize(guild.maximumPresences.toString()))

    return message.util.send({ embed })
  }
}

export default CapsCommand
