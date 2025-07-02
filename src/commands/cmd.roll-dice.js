import { PermissionFlagsBits } from 'discord.js'
import { randomInteger } from '../utilities/random-util.js'
import { dedent } from '../utilities/string-util.js'

export default {
  interaction: 'slash',
  name: 'roll',
  description: 'Roll up to 7 gaming dice',
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  options: [
    {
      type: 'integer',
      name: 'quantity',
      description: 'The number of dice you want to roll',
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
      type: 'integer',
      name: 'sides',
      description: 'The number of sides your dice should have',
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
  ],
  async execute ({ interaction }) {
    const quantity = interaction.options.getInteger('quantity')
    const sides = interaction.options.getInteger('sides')
    const roll = Array(quantity).fill(0).map(i => randomInteger(1, sides)).join(' • ')
    const dice = this.options[1].choices.find(choice => choice.value === sides)

    return interaction.reply({
      content: dedent`
      ## :game_die: You rolled ${quantity} ${dice.name}...
      ${roll}`
    })
  }
}
