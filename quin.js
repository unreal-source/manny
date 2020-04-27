import QuinClient from './struct/QuinClient'
import cli from 'commander'
import config from './quin.config'
import log from './util/logger'
import ms from 'ms'
import pkg from './package.json'
import * as Sentry from '@sentry/node'

cli
  .version(pkg.version)
  .option('-t, --token <token>', 'Bot token')
  .option('-o, --owner <id>', 'Owner ID')
  .option('-s, --sentry <dsn>', 'Sentry DSN')
  .parse(process.argv)

const owner = cli.owner ? cli.owner : process.env.OWNER_ID
const sentryDSN = cli.sentry ? cli.sentry : process.env.SENTRY_DSN
const token = cli.token ? cli.token : process.env.BOT_TOKEN

const client = new QuinClient(config, owner)

if (sentryDSN) {
  Sentry.init({ dsn: sentryDSN })
}

client
  .on('warn', warning => log.warn(warning))
  .on('error', error => log.error(error))
  .on('disconnect', () => log.warn('Connection lost...'))
  .on('reconnect', () => log.info('Attempting to reconnect...'))

process.on('unhandledRejection', error => {
  log.error(`An unhandled promise rejection occured:\n${error}`)
})

client.start(token)
