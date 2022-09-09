import { readFile } from 'node:fs/promises'
import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js'
import yaml from 'js-yaml'
import log from '../../utilities/logger.js'

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
      ],
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async choices () {
    const file = await readFile('./src/commands/utility/faq.yml')
    const data = await yaml.load(file)
    return data
  }

  async run (interaction) {
    const question = interaction.options.getString('question')
    const choices = await this.choices()
    const answer = choices.find(choice => choice.question === question).answer

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ content: `:question: **${question}**\n${answer}` })
  }
}

export default FAQ
