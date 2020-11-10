import { Command } from 'discord-akairo'

class InviteCommand extends Command {
  constructor () {
    super('invite', {
      aliases: ['invite'],
      category: 'Info',
      description: {
        name: 'Invite',
        short: 'Get the server\'s invite link.',
        syntax: '!invite'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES']
    })
  }

  exec (message) {
    return message.util.send(`https://discord.gg/${message.guild.vanityURLCode}`)
  }
}

export default InviteCommand
