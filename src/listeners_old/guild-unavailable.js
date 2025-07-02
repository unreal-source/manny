import { Listener } from 'hiei.js'
import log from '../utilities/logger.js'

class GuildUnavailable extends Listener {
  constructor () {
    super({
      name: 'GuildUnavailable',
      emitter: 'client',
      event: 'guildUnavailable'
    })
  }

  run (guild) {
    return log.warn({ event: 'guild-unavailable', guild: guild.name }, `${guild.name} is unavailable`)
  }
}

export default GuildUnavailable
