import { Listener } from 'discord-akairo'
import config from '../../config'

class VoiceStateUpdateListener extends Listener {
  constructor () {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    })
  }

  exec (oldState, newState) {
    if (oldState.channel === null && newState.channel !== null) {
      return newState.member.roles.add(config.roles.voice)
    }

    if (oldState.channel !== null && newState.channel === null) {
      return newState.member.roles.remove(config.roles.voice)
    }
  }
}

export default VoiceStateUpdateListener
