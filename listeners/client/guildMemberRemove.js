import { Listener } from 'discord-akairo'

class GuildMemberRemoveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove'
    })
  }

  exec (member) {
    const channel = this.client.channels.cache.find(c => c.name === this.client.config.userLogChannel)

    if (member.user.bot) {
      return channel.send(`:robot: **${member.user.tag}** was removed from the server.`)
    }

    return channel.send(`:outbox_tray: **${member.user.tag}** left the server.`)
  }
}

export default GuildMemberRemoveListener
