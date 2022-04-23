import { GatewayIntentBits } from 'discord.js'
import { HieiClient } from 'hiei.js'

const client = new HieiClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
})

client.login(process.env.TOKEN)
