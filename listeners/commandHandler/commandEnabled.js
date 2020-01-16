import { Listener } from 'discord-akairo'
import log from '../../util/logger.js'

class CommandEnabledListener extends Listener {
  constructor () {
    super('commandEnabled', {
      emitter: 'commandHandler',
      eventName: 'enable'
    })
  }

  async exec (command) {
    // Get the mod log channel
    const channel = await this.client.channels.find(c => c.name === this.client.config.modLogChannel)

    // Log for debugging
    log.info(`The ${command.id} command was enabled.`)

    // Send the message
    return channel.send(`:white_check_mark: The **${command.id}** command was enabled.`)
  }
}

export default CommandEnabledListener
