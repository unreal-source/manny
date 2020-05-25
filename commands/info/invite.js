import { Command } from 'discord-akairo'

class InviteCommand extends Command {
  constructor () {
    super('invite', {
      aliases: ['invite'],
      category: 'Info',
      description: {
        name: 'Invite',
        content: 'Get the invite link for this server',
        usage: '!invite'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  exec (message) {
    return message.util.send(`https://discord.gg/${message.guild.vanityURLCode}`)
  }
}

export default InviteCommand
