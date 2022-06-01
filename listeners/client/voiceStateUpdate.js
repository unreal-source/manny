import { Listener } from 'discord-akairo'
import config from '../../config'
import _ from '../../utilities/Util'

class VoiceStateUpdateListener extends Listener {
  constructor () {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    })
  }

  async exec (oldState, newState) {
    const channel = this.client.channels.cache.get(config.channels.logs.voiceLog)
    const canStream = newState.member.roles.cache.some(role => role.id === config.roles.stream)
    const isModerator = newState.member.roles.cache.some(role => role.id === config.roles.moderator)
    const username = isModerator ? `${_.prefix('moderator')} **${newState.member.displayName}**` : `<@${newState.member.id}>`

    // User joined a voice channel
    if (oldState.channel === null && newState.channel !== null) {
      // await newState.member.roles.add(config.roles.voice)
      // this.client.log.info(`Voice role added >> ${newState.member.user.tag}`)

      channel.send(`${username} joined **${newState.channel.name}**`)
    }

    // User left a voice channel
    if (oldState.channel !== null && newState.channel === null) {
      // await newState.member.roles.remove(config.roles.voice)
      // this.client.log.info(`Voice role removed >> ${newState.member.user.tag}`)

      channel.send(`${username} left **${oldState.channel.name}**`)
    }

    // User left a voice channel or switched voice channels
    if (oldState.channel !== newState.channel) {
      if (canStream) {
        await newState.member.roles.remove(config.roles.stream)
        this.client.log.info(`Streaming role removed >> ${newState.member.user.tag}`)
      }
    }

    // User started streaming
    if (!oldState.streaming && newState.streaming) {
      channel.send(`${username} started streaming in **${newState.channel.name}**`)
    }

    // User stopped streaming
    if (oldState.streaming && !newState.streaming) {
      channel.send(`${username} stopped streaming in **${oldState.channel.name}**`)
    }
  }
}

export default VoiceStateUpdateListener
