import { Command } from 'discord-akairo'
import pkg from '../../package.json'

class VersionCommand extends Command {
  constructor() {
    super('version', {
      aliases: ['version'],
      category: 'System',
      description: {
        content: 'Get the version number of the bot.',
        usage: '!version'
      },
      channelRestriction: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      protected: true
    })
  }

  async exec (message) {
    // Return the bot's current version number
    return message.util.send(pkg.version)
  }
}

export default VersionCommand