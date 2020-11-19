import MannyClient from './structures/MannyClient'
import config from './config'
import * as Sentry from '@sentry/node'

const client = new MannyClient(config)

client
  .on('warn', warning => client.log.warn(warning))
  .on('error', error => client.log.error(error))
  .on('disconnect', () => client.log.warn('Connection lost...'))
  .on('reconnect', () => client.log.info('Attempting to reconnect...'))

client.start()

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
  client.log.success('Sentry connection succesful')
} else {
  client.log.warn('SENTRY_DSN not found, skipping Sentry initialization')
}

process.on('unhandledRejection', error => {
  client.log.error(`Unhandled promise rejection!\n${error}`)
})
