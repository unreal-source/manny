import QuinClient from './struct/QuinClient'
import cli from 'commander'
import config from './quin.config.js'
import pkg from './package.json'

cli
.version(pkg.version)
.option('-t, --token <token>', 'Bot token')
.option('-o, --owner <id>', 'Owner ID')
.parse(process.argv)

const token = cli.token ? cli.token : process.env.BOT_TOKEN
const owner = cli.owner ? cli.owner : process.env.OWNER_ID

const client = new QuinClient(config, owner)


client.login(token)
