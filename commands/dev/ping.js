import { Command } from 'discord-akairo'

class PingCommand extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'Developer',
      description: {
        name: 'Ping',
        short: 'Check the bot\'s latency.',
        syntax: '!ping'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async exec (message) {
    const reply = await message.util.send(':ping_pong: Pong!')
    const difference = (reply.editedAt || reply.createdAt) - (message.editedAt || message.createdAt)
    return message.util.send(`:ping_pong: Pong! Response Time: **${difference}ms**`)
  }
}

export default PingCommand
