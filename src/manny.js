import { GatewayIntentBits } from 'discord.js'
import { HieiClient } from 'hiei.js'
import log from './utilities/logger.js'

const client = new HieiClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
})

client.login(process.env.TOKEN)

process.on('uncaughtException', (error) => {
  log.error({ event: 'uncaught-exception', error })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  log.error({ event: 'unhandled-rejection', promise, reason })
  process.exit(1)
})
