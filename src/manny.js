import { Intents } from 'discord.js'
import { HieiClient } from 'hiei.js'

const client = new HieiClient({
  commands: 'src/commands',
  listeners: 'src/listeners',
  options: {
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ]
  }
})

client.login(process.env.TOKEN)
