import { Command } from 'discord-akairo'
import _ from '../../utilities/Util'

class EightBallCommand extends Command {
  constructor () {
    super('8ball', {
      aliases: ['8ball', 'ask'],
      category: 'Fun',
      description: {
        name: 'Magic 8-Ball',
        content: 'Ask the Magic 8-Ball a question',
        usage: '!8ball <question>'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES']
    })
  }

  * args () {
    const question = yield {
      match: 'rest',
      prompt: {
        start: 'Ask the Magic 8-Ball a question.'
      }
    }

    return { question }
  }

  async exec (message, { question }) {
    const replies = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes – definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      'Don\'t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.'
    ]

    return message.reply(`:8ball: ${_.randomElement(replies)}`)
  }
}

export default EightBallCommand
