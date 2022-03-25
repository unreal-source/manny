import { Intents } from 'discord.js'
import { HieiClient } from 'hiei.js'

const client = new HieiClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES
  ]
})

client.login(process.env.TOKEN)
