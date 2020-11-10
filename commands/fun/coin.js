import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class CoinFlipCommand extends Command {
  constructor () {
    super('coin', {
      aliases: ['coin', 'coinflip'],
      category: 'Fun',
      description: {
        name: 'Coin Flip',
        short: 'Flip a coin.',
        syntax: '!coin'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    return message.reply(`:coin: ${_.randomElement(['Heads', 'Tails'])}`)
  }
}

export default CoinFlipCommand
