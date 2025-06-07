import { SlashCommand } from 'hiei.js'
import { PermissionFlagsBits } from 'discord.js'
import { randomElement } from '../../utilities/random-util.js'
import log from '../../utilities/logger.js'

class CoinToss extends SlashCommand {
  constructor () {
    super({
      name: 'coin',
      description: 'Flip a coin',
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })
    return interaction.reply({ content: `:coin: ${randomElement(['Heads', 'Tails'])}` })
  }
}

export default CoinToss
