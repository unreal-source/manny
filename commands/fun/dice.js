import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class DiceCommand extends Command {
  constructor () {
    super('dice', {
      aliases: ['dice', 'roll'],
      category: 'Fun',
      description: {
        name: 'Roll Dice',
        content: 'Roll the dice',
        usage: '!dice <count> <die>'
      },
      channel: 'guild'
    })
  }

  * args () {
    const count = yield {
      type: 'integer',
      prompt: {
        start: 'How many dice do you want to roll?',
        retry: 'Please enter an integer.'
      }
    }

    const die = yield {
      type: 'dice',
      prompt: {
        start: 'Which dice do you want to roll?',
        retry: 'Please use one of the following dice: d2, d3, d4, d5, d6, d8, d10, d12, d20, d100'
      }
    }

    return { count, die }
  }

  async exec (message, { count, die }) {
    const sides = parseInt(die.substr(1))
    const roll = Array(count).fill(0).map(i => _.randomInt(1, sides)).join(', ')

    return message.reply(`:game_die: ${roll}`)
  }
}

export default DiceCommand
