import { ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, time } from 'discord.js'
import { log } from '../utilities/logger.js'

export default {
  event: 'guildMemberRemove',
  emitter: 'client',
  async execute(member, client) {
    const memberLog = await client.channels.fetch(process.env.MEMBER_LOG_CHANNEL)

    return memberLog.send({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### :red_circle:   <@${member.user.id}> left the server`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${member.user.id} • Joined ${time(member.joinedAt, 'R')}`))
      ],
      flags: [MessageFlags.IsComponentsV2]
    })
  }
}
