import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class RollCommand extends Command {
  constructor () {
    super('roll', {
      aliases: ['roll', 'dice'],
      category: 'Fun',
      description: {
        name: 'Roll Dice',
        short: 'Roll up to 7 gaming dice.',
        syntax: '!roll count die',
        args: {
          count: 'The number of dice to roll, up to a maximum of 7.',
          die: 'The type of dice to roll: d4, d6, d8, d10, d12, or d20.'
        }
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES']
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
        retry: 'Please use one of the following dice: d4, d6, d8, d10, d12, d20'
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

export default RollCommand
