import { SlashCommand } from 'hiei.js'
import { randomElement } from '../../utilities/util.js'

class Magic8Ball extends SlashCommand {
  constructor () {
    super({
      name: '8ball',
      description: 'Ask the Magic 8-Ball a yes/no question',
      options: [
        {
          type: 'STRING',
          name: 'question',
          description: 'The yes/no question you want to ask',
          required: true
        }
      ]
    })
  }

  async run (interaction) {
    const question = interaction.options.getString('question')
    const answers = [
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

    return interaction.reply({ content: `:question: **${question}**\n:8ball: ${randomElement(answers)}` })
  }
}

export default Magic8Ball
