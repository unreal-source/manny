import { AkairoClient } from 'discord-akairo'
import path from 'path'

class QuinClient extends AkairoClient {
  constructor (config, owner) {
    super({
      // Akairo options
      ownerId: owner,
      prefix: config.defaultPrefix,
      allowMention: true,
      commandUtil: true,
      handleEdits: true,
      commandDirectory: path.join(__dirname, '..', 'commands'),
      listenerDirectory: path.join(__dirname, '..', 'listeners')
    }, {
      // Discord.js options
      disableEveryone: true,
      disabledEvents: ['TYPING_START']
    })

    this.config = config
  }
}

export default QuinClient
