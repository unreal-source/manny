import { log } from '../utilities/logger.js'

export default {
  event: 'ready',
  emitter: 'client',
  once: true,
  async execute (client) {
    const guild = await client.guilds.fetch(process.env.GUILD)
    log.info({ event: 'client-ready', guild: guild.name }, `${client.user.username} successfully connected to ${guild.name}`)
  }
}
