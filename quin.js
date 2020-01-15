import QuinClient from './struct/QuinClient'
import cli from 'commander'
import config from './quin.config.js'
import pkg from './package.json'
import * as Sentry from '@sentry/node'

cli
  .version(pkg.version)
  .option('-t, --token <token>', 'Bot token')
  .option('-o, --owner <id>', 'Owner ID')
  .option('-s, --sentry <dsn>', 'Sentry DSN')
  .parse(process.argv)

const token = cli.token ? cli.token : process.env.BOT_TOKEN
const owner = cli.owner ? cli.owner : process.env.OWNER_ID
const dsn = cli.sentry ? cli.sentry : process.env.SENTRY_DSN

const client = new QuinClient(config, owner)

Sentry.init({ dsn: dsn })

client.login(token)
