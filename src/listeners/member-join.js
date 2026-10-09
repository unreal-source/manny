import { time } from 'discord.js'
import { Listener } from 'hiei.js'
import ms from 'ms'

class MemberJoin extends Listener {
  constructor () {
    super({
      name: 'MemberJoin',
      emitter: 'client',
      event: 'guildMemberAdd'
    })
  }

  async run (member) {
    const memberLog = await this.client.channels.fetch(process.env.MEMBER_LOG_CHANNEL)
    const newAccountThreshold = new Date(Date.now() - ms(process.env.NEW_ACCOUNT_THRESHOLD))

    if (member.user.bot) {
      return memberLog.send({ content: `:robot: <@${member.user.id}> was added to the server • Account created ${time(member.user.createdAt, 'R')}` })
    }

    if (member.createdAt > newAccountThreshold) {
      return memberLog.send({ content: `:new: <@${member.user.id}> **joined the server** • Account created ${time(member.user.createdAt, 'R')}` })
    }

    return memberLog.send({ content: `:green_circle: <@${member.user.id}> **joined the server** • Account created ${time(member.user.createdAt, 'R')}` })
  }
}

export default MemberJoin
