import MannyClient from './structures/MannyClient'
import config from './config'
import log from './utilities/logger'
import * as Sentry from '@sentry/node'

const client = new MannyClient(config)

client
  .on('warn', warning => log.warn(warning))
  .on('error', error => log.error(error))
  .on('disconnect', () => log.warn('Connection lost...'))
  .on('reconnect', () => log.info('Attempting to reconnect...'))

client.start()

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
} else {
  log.warn('Sentry DSN not found. Skipping Sentry initialization.')
}

process.on('unhandledRejection', error => {
  log.error(`An unhandled promise rejection occured:\n${error}`)
})
