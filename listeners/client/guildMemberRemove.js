import { Listener } from 'discord-akairo'

class GuildMemberRemoveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      emitter: 'client',
      eventName: 'guildMemberRemove'
    })
  }

  async exec (member) {
    // Get the server log channel
    const channel = this.client.channels.find(c => c.name === this.client.config.userLogChannel)

    // Initialize log message
    let message = `:outbox_tray: **${member.user.tag}** left the server.`

    // Check if the member is a bot
    if (member.user.bot) {
      message += ' :robot: `BOT`'
    }

    return channel.send(message)
  }
}

export default GuildMemberRemoveListener
