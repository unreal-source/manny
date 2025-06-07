import { Client, GatewayIntentBits } from 'discord.js'
import { createInteractionHandler, createEventHandler } from 'hiei.js'
// import * as Sentry from '@sentry/node'
// import api from './api/server.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
})

createInteractionHandler(client, {
  commandDirectory: 'src/commands',
  componentDirectory: 'src/components'
})

createEventHandler(client, {
  eventDirectory: 'src/events'
})

// Sentry.init({
//   environment: process.env.SENTRY_ENVIRONMENT,
//   dsn: process.env.SENTRY_DSN
// })

await client.login(process.env.TOKEN)

// api.configure(client)
// api.start()
