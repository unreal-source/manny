import { Argument, Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class RollCommand extends Command {
  constructor () {
    super('roll', {
      aliases: ['roll', 'dice'],
      category: 'Fun',
      description: {
        name: 'Roll Dice',
        short: 'Roll up to 7 gaming dice.',
        syntax: '!roll count dice',
        args: {
          count: 'The number of dice to roll, up to a maximum of 7.',
          dice: 'The type of dice to roll: d4, d6, d8, d10, d12, or d20.'
        }
      },
      clientPermissions: ['SEND_MESSAGES']
    })
  }

  * args () {
    const count = yield {
      type: Argument.range('integer', 1, 7, true),
      prompt: {
        start: 'How many dice do you want to roll?',
        retry: 'Please enter a number between 1 and 7.'
      }
    }

    const dice = yield {
      type: 'dice',
      prompt: {
        start: 'What type of dice do you want to roll?',
        retry: 'Choose one of these available dice: d4, d6, d8, d10, d12, d20'
      }
    }

    return { count, dice }
  }

  async exec (message, { count, dice }) {
    const sides = parseInt(dice.substr(1))
    const roll = Array(count).fill(0).map(i => _.randomInt(1, sides)).join(', ')

    return message.reply(`:game_die: ${roll}`)
  }
}

export default RollCommand
