import { time } from 'discord.js'
import { Listener } from 'hiei.js'

class MemberLeave extends Listener {
  constructor () {
    super({
      name: 'MemberLeave',
      emitter: 'client',
      event: 'guildMemberRemove'
    })
  }

  async run (member) {
    const memberLog = await this.client.channels.fetch(process.env.MEMBER_LOG_CHANNEL)
    return memberLog.send({ content: `:red_circle: **${member.user.username} left the server** • Joined the server ${time(member.joinedAt, 'R')}` })
  }
}

export default MemberLeave
