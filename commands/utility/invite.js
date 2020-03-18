import { Command } from 'discord-akairo'

class InviteCommand extends Command {
  constructor () {
    super('invite', {
      aliases: ['invite'],
      category: 'Utility',
      description: {
        content: 'Get the invite link for this server',
        usage: '!invite'
      },
      channelRestriction: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  exec (message) {
    return message.util.send(`https://discord.gg/${message.guild.vanityURLCode}`)
  }
}

export default InviteCommand
