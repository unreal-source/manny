import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import cli from 'commander'
import config from './quin.config.js'
import log from './util/logger.js'
import ms from 'ms'
import pkg from './package.json'
import * as Sentry from '@sentry/node'

// CLI
cli
  .version(pkg.version)
  .option('-t, --token <token>', 'Bot token')
  .option('-o, --owner <id>', 'Owner ID')
  .option('-s, --sentry <dsn>', 'Sentry DSN')
  .parse(process.argv)

// Sentry
Sentry.init({ dsn: cli.sentry ? cli.sentry : process.env.SENTRY_DSN })

// Discord client
class QuinClient extends AkairoClient {
  constructor () {
    super({
      // Akairo options
      ownerId: cli.owner ? cli.owner : process.env.OWNER_ID
    }, {
      // Discord.js options
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

    // Config
    this.config = config

    // Commands
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

    this.commandHandler.loadAll()
    this.commandHandler.useListenerHandler(this.listenerHandler)

    // Listeners
    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners/'
    })

    this.listenerHandler.loadAll()
  }
}

const client = new QuinClient()

client.login(cli.token ? cli.token : process.env.BOT_TOKEN)

// Report unhandled promise rejections
process.on('unhandledRejection', err => {
  log.error('Unhandled Promise Rejection!')
  log.error(err)
})
