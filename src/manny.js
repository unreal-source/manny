import { GatewayIntentBits } from 'discord.js'
import { HieiClient } from 'hiei.js'

const client = new HieiClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
})

client.login(process.env.TOKEN)
