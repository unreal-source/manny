import { Command } from 'discord-akairo'
import ms from 'pretty-ms'

class UptimeCommand extends Command {
  constructor () {
    super('uptime', {
      aliases: ['uptime'],
      category: 'Developer',
      description: {
        name: 'Uptime',
        short: 'Check how long it\'s been since the last time the bot logged in.',
        syntax: '!uptime'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async exec (message) {
    const uptime = await ms(this.client.uptime, { secondsDecimalDigits: 0 })
    return message.util.send(`:stopwatch: Uptime: **${uptime}**`)
  }
}

export default UptimeCommand
