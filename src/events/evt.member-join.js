import { ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, time } from 'discord.js'
import { log } from '../utilities/logger.js'
import ms from 'ms'

export default {
  event: 'guildMemberAdd',
  emitter: 'client',
  async execute(member, client) {
    const memberLog = await client.channels.fetch(process.env.MEMBER_LOG_CHANNEL)
    const newAccountThreshold = new Date(Date.now() - ms(process.env.NEW_ACCOUNT_THRESHOLD))

    if (member.user.bot) {
      return memberLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### :robot:   <@${member.user.id}> was added to the server`))
            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${member.user.id} • Account created ${time(member.user.createdAt, 'R')}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }

    if (member.user.createdAt > newAccountThreshold) {
      return memberLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### :new:   <@${member.user.id}> joined the server`))
            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${member.user.id} • Account created ${time(member.user.createdAt, 'R')}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }

    return memberLog.send({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### :green_circle:   <@${member.user.id}> joined the server`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${member.user.id} • Account created ${time(member.user.createdAt, 'R')}`))
      ],
      flags: [MessageFlags.IsComponentsV2]
    })
  }
}
