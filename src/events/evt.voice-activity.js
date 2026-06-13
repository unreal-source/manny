import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from 'discord.js'
import { isStaff } from '../utilities/discord-util.js'
import { log } from '../utilities/logger.js'

export default {
  event: 'voiceStateUpdate',
  emitter: 'client',
  async execute (oldState, newState, client) {
    if (oldState.channel === newState.channel) return

    const voiceLog = await client.channels.fetch(process.env.VOICE_LOG_CHANNEL)
    const username = isStaff(newState.member) ? `:shield: **${newState.member.displayName}**` : `<@${newState.member.id}>`
    const canStream = newState.member.roles.cache.some(role => role.id === process.env.STREAMING_ROLE)

    // Member joined voice channel
    if (oldState.channel === null && newState.channel !== null) {
      voiceLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${username} joined ${newState.channel}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }

    // Member left voice channel
    if (oldState.channel !== null && newState.channel === null) {
      if (canStream) {
        await newState.member.roles.remove(process.env.STREAMING_ROLE)
      }

      voiceLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${username} left ${oldState.channel}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }

    // Member moved between voice channels
    if (oldState.channel !== newState.channel && oldState.channel !== null && newState.channel !== null) {
      if (canStream) {
        await newState.member.roles.remove(process.env.STREAMING_ROLE)
      }

      voiceLog.send({
        components: [
          new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${username} moved from ${oldState.channel} to ${newState.channel}`))
        ],
        flags: [MessageFlags.IsComponentsV2]
      })
    }
  }
}
