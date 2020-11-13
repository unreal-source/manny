import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import Database from './Database'
import ms from 'ms'
import { Signale } from 'signale'
import Case from '../models/cases'

class MannyClient extends AkairoClient {
  constructor (config) {
    super({ ownerID: process.env.OWNER_ID }, {
      disableMentions: 'everyone',
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MEMBERS',
          'GUILD_BANS',
          'GUILD_VOICE_STATES',
          'GUILD_PRESENCES',
          'GUILD_MESSAGES',
          'DIRECT_MESSAGES'
        ]
      }
    })

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      allowMention: true,
      commandUtil: true,
      commandUtilLifetime: ms('2m'),
      handleEdits: true,
      prefix: config.commands.defaultPrefix,
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

    this.commandHandler.resolver.addTypes({
      confirm: (message, phrase) => {
        if (!phrase) return null
        if (phrase.match(/^(?:yes|y)$/gi)) return true
        if (phrase.match(/^(?:no|n)$/gi)) return false
        return null
      },
      dice: (message, phrase) => {
        if (!phrase) return null
        if (phrase.match(/^d(4|6|8|10|12|20)$/)) return phrase
        return null
      },
      duration: (message, phrase) => {
        if (!phrase) return null
        if (ms(phrase) !== undefined) return ms(phrase)
        return null
      },
      infraction: async (message, phrase) => {
        if (!phrase) return null

        const record = await Case.findOne({
          where: { id: phrase }
        })

        if (record) return record
        return null
      },
      job: async (message, phrase) => {
        if (!phrase) return null

        const category = message.guild.channels.cache.get(config.jobs.category)
        for (const channel of category.children.values()) {
          try {
            return await channel.messages.fetch(phrase)
          } catch (e) {
            continue
          }
        }

        return null
      }
    })

    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners/'
    })

    this.log = new Signale()
  }

  init () {
    this.commandHandler.useListenerHandler(this.listenerHandler)

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    })

    this.commandHandler.loadAll()
    this.log.info('Commands loaded')
    this.listenerHandler.loadAll()
    this.log.info('Listeners loaded')
  }

  async start () {
    await this.init()

    if (process.env.DATABASE_URL) {
      await Database.authenticate()
    } else {
      this.log.warn('DATABASE_URL not found, skipping database connection')
    }

    return this.login(process.env.BOT_TOKEN)
  }
}

export default MannyClient
