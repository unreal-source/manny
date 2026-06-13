import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from 'discord.js'
import { isStaff } from '../utilities/discord-util.js'
import { log } from '../utilities/logger.js'

export default {
  event: 'voiceStateUpdate',
  emitter: 'client',
  async execute (oldState, newState, client) {
    if (oldState.streaming === newState.streaming) return

    const voiceLog = await client.channels.fetch(process.env.VOICE_LOG_CHANNEL)
    const username = isStaff(newState.member) ? `:shield: **${newState.member.displayName}**` : `<@${newState.member.id}>`

    // Member started streaming
    if (!oldState.streaming && newState.streaming) {
      voiceLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${username} started streaming in ${newState.channel}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }

    // Member stopped streaming
    if (oldState.streaming && !newState.streaming) {
      voiceLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${username} stopped streaming in ${newState.channel}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }
  }
}
