import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import Database from './Database'
import log from '../utilities/logger'
import ms from 'ms'

class MannyClient extends AkairoClient {
  constructor (config) {
    super({ ownerID: process.env.OWNER_ID }, {
      disableMentions: 'everyone',
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MEMBERS',
          'GUILD_BANS',
          'GUILD_EMOJIS',
          'GUILD_VOICE_STATES',
          'GUILD_PRESENCES',
          'GUILD_MESSAGES',
          'GUILD_MESSAGE_REACTIONS',
          'DIRECT_MESSAGES',
          'DIRECT_MESSAGE_REACTIONS'
        ]
      }
    })

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      allowMention: true,
      commandUtil: true,
      handleEdits: true,
      prefix: config.defaultPrefix,
      argumentDefaults: {
        prompt: {
          cancel: 'OK. The command was cancelled.',
          ended: 'Too many attempts. Please start again.',
          timeout: 'The timer expired. Please start again.',
          retries: 3,
          time: ms('5m')
        }
      }
    })

    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners/'
    })

    this.setup()
  }

  setup () {
    this.commandHandler.useListenerHandler(this.listenerHandler)

    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
  }

  async start () {
    if (process.env.DB_URL) {
      await Database.authenticate()
    } else {
      log.warn('DB_URL not found, skipping database connection')
    }

    return this.login(process.env.BOT_TOKEN)
  }
}

export default MannyClient
