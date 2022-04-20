import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType } from 'discord.js'

class Avatar extends SlashCommand {
  constructor () {
    super({
      name: 'avatar',
      description: 'View a large version of someone\'s avatar',
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: 'user',
          description: 'The user who\'s avatar you want to see',
          required: true
        }
      ]
    })
  }

  async run (interaction) {
    const user = interaction.options.getUser('user')

    return interaction.reply({ content: user.displayAvatarURL({ size: 512 }), ephemeral: true })
  }
}

export default Avatar
