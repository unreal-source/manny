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
    // Reply with invite link
    return message.util.send(`https://discord.gg/${message.guild.fetchVanityCode()}`)
  }
}

export default InviteCommand
