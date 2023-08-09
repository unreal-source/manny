import { GatewayIntentBits } from 'discord.js'
import { HieiClient } from 'hiei.js'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing' // eslint-disable-line
import webhookServer from './webhooks/server.js'

const client = new HieiClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
})

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  tracesSampleRate: 1.0
})

await client.login(process.env.TOKEN)

webhookServer.configure(client)
webhookServer.start()
