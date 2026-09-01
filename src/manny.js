import * as Sentry from '@sentry/node'
import { GatewayIntentBits } from 'discord.js'
import { HieiClient } from 'hiei.js'
import api from './api/server.js'

const client = new HieiClient({
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

Sentry.init({
  environment: process.env.SENTRY_ENVIRONMENT,
  dsn: process.env.SENTRY_DSN
})

await client.login(process.env.TOKEN)

api.configure(client)
api.start()
