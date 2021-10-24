import { SlashCommand } from 'hiei.js'
import { randomElement } from '../../../utilities/Util.js'

class CoinToss extends SlashCommand {
  constructor () {
    super({
      name: 'coin',
      description: 'Flip a coin'
    })
  }

  async run (interaction) {
    return interaction.reply({ content: `:coin: ${randomElement(['Heads', 'Tails'])}` })
  }
}

export default CoinToss
