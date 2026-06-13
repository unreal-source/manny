import { log } from '../utilities/logger.js'

export default {
  event: 'guildUnavailable',
  emitter: 'client',
  async execute (guild) {
    return log.warn({ event: 'guild-unavailable', guild: guild.name }, `${guild.name} is unavailable`)
  }
}
