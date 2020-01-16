import { Listener } from 'discord-akairo'
import log from '../../util/logger.js'

class CommandDisabledListener extends Listener {
  constructor () {
    super('commandDisabled', {
      emitter: 'commandHandler',
      eventName: 'disable'
    })
  }

  async exec (command) {
    // Get the mod log channel
    const channel = await this.client.channels.find(c => c.name === this.client.config.modLogChannel)

    // Log for debugging
    log.info(`The ${command.id} command was disabled.`)

    // Send the message
    return channel.send(`:no_entry_sign: The **${command.id}** command was disabled.`)
  }
}

export default CommandDisabledListener
