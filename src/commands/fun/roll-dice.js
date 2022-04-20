import { ApplicationCommandOptionType } from 'discord.js'
import { SlashCommand } from 'hiei.js'
import { randomInteger } from '../../utilities/random-util.js'

class RollDice extends SlashCommand {
  constructor () {
    super({
      name: 'roll',
      description: 'Roll up to 7 gaming dice',
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: 'quantity',
          description: 'The number of dice you want to roll.',
          required: true,
          choices: [
            { name: '1', value: 1 },
            { name: '2', value: 2 },
            { name: '3', value: 3 },
            { name: '4', value: 4 },
            { name: '5', value: 5 },
            { name: '6', value: 6 },
            { name: '7', value: 7 }
          ]
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: 'sides',
          description: 'The number of sides your dice should have.',
          required: true,
          choices: [
            { name: 'd4', value: 4 },
            { name: 'd6', value: 6 },
            { name: 'd8', value: 8 },
            { name: 'd10', value: 10 },
            { name: 'd12', value: 12 },
            { name: 'd20', value: 20 }
          ]
        }
      ]
    })
  }

  async run (interaction) {
    const quantity = interaction.options.getInteger('quantity')
    const sides = interaction.options.getInteger('sides')
    const roll = Array(quantity).fill(0).map(i => randomInteger(1, sides)).join(', ')

    return interaction.reply({ content: `:game_die: ${roll}` })
  }
}

export default RollDice
