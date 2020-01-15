import { Command } from 'discord-akairo'

class PingCommand extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'System',
      description: {
        content: 'Ping the bot to check its latency.',
        usage: '!ping'
      },
      channelRestriction: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      protected: true
    })
  }

  async exec (message) {
    // Initial response
    const reply = await message.util.send(':ping_pong: Pong!')

    // Time when the initial response reached the user
    const replyTime = await reply.editedTimestamp || reply.createdTimestamp

    // Time when the original message was sent by the user
    const messageTime = await message.editedTimestamp || message.createdTimestamp

    // Final response with calculated latency in milliseconds
    return message.util.send(`:ping_pong: Pong! I took **${replyTime - messageTime}ms** to respond.`)
  }
}

export default PingCommand
