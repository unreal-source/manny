import * as Sentry from '@sentry/node'
import { Client, GatewayIntentBits } from 'discord.js'
import { createInteractionHandler, createEventHandler } from 'hiei.js'
import api from './api/server.js'

Sentry.init({
  environment: process.env.SENTRY_ENVIRONMENT,
  dsn: process.env.SENTRY_DSN
})

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
})

client.suspects = new Map()

createInteractionHandler(client, {
  commandsDirectory: 'src/interactions/commands'
})

// createEventHandler({
//   eventsDirectory: './src/events'
// })

await client.login(process.env.TOKEN)

api.configure(client)
api.start()
