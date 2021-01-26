import { Listener } from 'discord-akairo'
import config from '../../config'

class VoiceStateUpdateListener extends Listener {
  constructor () {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    })
  }

  async exec (oldState, newState) {
    const channel = this.client.channels.cache.get(config.channels.logs.voiceLog)

    // User joined a voice channel
    if (oldState.channel === null && newState.channel !== null) {
      await newState.member.roles.add(config.roles.voice)
      this.client.log.info(`Voice role added >> ${newState.member.user.tag}`)

      return channel.send(`<@${newState.member.id}> joined **${newState.channel.name}**`)
    }

    // User left a voice channel
    if (oldState.channel !== null && newState.channel === null) {
      await newState.member.roles.remove(config.roles.voice)
      this.client.log.info(`Voice role removed >> ${newState.member.user.tag}`)

      return channel.send(`<@${newState.member.id}> left **${oldState.channel.name}**`)
    }
  }
}

export default VoiceStateUpdateListener
