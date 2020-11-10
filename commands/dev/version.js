import { Command } from 'discord-akairo'
import pkg from '../../package.json'

class VersionCommand extends Command {
  constructor () {
    super('version', {
      aliases: ['version', 'v'],
      category: 'Developer',
      description: {
        name: 'Version',
        short: 'Get the bot\'s version number.',
        syntax: '!version'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  exec (message) {
    return message.util.send(pkg.version)
  }
}

export default VersionCommand
