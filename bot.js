import MannyClient from './structures/MannyClient'
import cli from 'commander'
import config from './bot.config'
import log from './utilities/logger'
import pkg from './package.json'
import * as Sentry from '@sentry/node'

cli
  .version(pkg.version)
  .option('-db, --database <url>', 'Database URL')
  .option('-o, --owner <id>', 'Owner ID')
  .option('-s, --sentry <dsn>', 'Sentry DSN')
  .option('-t, --token <token>', 'Bot token')
  .parse(process.argv)

const dbURL = cli.database ? cli.database : process.env.DATABASE_URL
const ownerID = cli.owner ? cli.owner : process.env.OWNER_ID
const sentryDSN = cli.sentry ? cli.sentry : process.env.SENTRY_DSN
const token = cli.token ? cli.token : process.env.BOT_TOKEN

if (!sentryDSN) {
  log.warn('Sentry DSN not found. Skipping Sentry initialization.')
} else {
  Sentry.init({ dsn: sentryDSN })
}

if (!dbURL) {
  log.warn('Database URL not found. Skipping database connection.')
}

const client = new MannyClient(config, ownerID)

client
  .on('warn', warning => log.warn(warning))
  .on('error', error => log.error(error))
  .on('disconnect', () => log.warn('Connection lost...'))
  .on('reconnect', () => log.info('Attempting to reconnect...'))

client.start(token, dbURL)

process.on('unhandledRejection', error => {
  log.error(`An unhandled promise rejection occured:\n${error}`)
})
