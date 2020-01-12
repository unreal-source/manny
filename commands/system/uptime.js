import { Command } from 'discord-akairo'
import ms from 'pretty-ms'

class UptimeCommand extends Command {
  constructor () {
    super('uptime', {
      aliases: ['uptime'],
      category: 'System',
      description: {
        content: 'Get the elapsed time since the bot last logged in.',
        usage: '!uptime'
      },
      channelRestriction: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      protected: true
    })
  }

  async exec (message) {
    // Get client uptime
    const uptime = await ms(this.client.uptime, { verbose: true, secDecimalDigits: 0 })

    // Send the message
    return message.util.send(`:stopwatch: I have been online for **${uptime}**.`)
  }
}

export default UptimeCommand
