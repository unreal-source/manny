import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType } from 'discord.js'

class FAQ extends SlashCommand {
  constructor () {
    super({
      name: 'faq',
      description: 'Quickly share the answer to a frequently asked question',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'question',
          description: 'The question you want to answer',
          required: true,
          autocomplete: true
        }
      ]
    })
  }

  get choices () {
    return [
      { name: 'Will my 4.x project open in 5.0?', value: 'Upgrading your 4.x project to 5.0? See this knowledge base article to learn more about version compatibility when upgrading your project.\n<https://forums.unrealengine.com/docs?topic=503528>' },
      { name: 'When does Epic release featured free Marketplace content?', value: 'Epic releases a new batch of featured free Marketplace content on the first Tuesday of each month.' }
    ]
  }

  async run (interaction) {
    const question = interaction.options.getString('question')
    const answer = this.choices.find(choice => choice.name === question).value

    return interaction.reply({ content: answer })
  }
}

export default FAQ
