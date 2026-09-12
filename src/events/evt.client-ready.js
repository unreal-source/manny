import { log } from 'evlog'

export default {
  event: 'clientReady',
  emitter: 'client',
  once: true,
  async execute (client) {
    const guild = await client.guilds.fetch(process.env.GUILD)
    log.info('auth', `${client.user.username} successfully connected to ${guild.name}`)
  }
}
