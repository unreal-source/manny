import { log } from 'evlog'

export default {
  event: 'clientReady',
  emitter: 'client',
  once: true,
  async execute (client) {
    const guild = await client.guilds.fetch(process.env.GUILD)
    log.info('ready', `${client.user.username} [${client.user.id}] connected to ${guild.name} [${guild.id}]`)
  }
}
