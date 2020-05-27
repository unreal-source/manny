import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import log from '../util/logger'
import ms from 'ms'
import Sequelize from 'sequelize'

class MannyClient extends AkairoClient {
  constructor (config, ownerID) {
    super({ ownerID: ownerID }, {
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

  async start (token, dbURL) {
    if (dbURL) {
      const db = new Sequelize(dbURL, { logging: false })
      const UserHistory = db.define('UserHistory', {
        user_id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        mutes: {
          type: Sequelize.ARRAY(Sequelize.JSONB)
        },
        strikes: {
          type: Sequelize.ARRAY(Sequelize.JSONB)
        },
        bans: {
          type: Sequelize.ARRAY(Sequelize.JSONB)
        }
      })

      try {
        await db.authenticate()
        await UserHistory.sync()
        log.success('Successfully connected to database.')
      } catch (error) {
        log.error('Failed to connect to database.')
        log.error(error)
        process.exit(1)
      }
    }

    return this.login(token)
  }
}

export default MannyClient
