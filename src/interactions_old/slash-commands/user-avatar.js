import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js'
import log from '../../utilities/logger.js'

class UserAvatar extends SlashCommand {
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
      ],
      defaultMemberPermissions: PermissionFlagsBits.BanMembers
    })
  }

  async run (interaction) {
    const user = interaction.options.getUser('user')

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ content: user.displayAvatarURL({ size: 512 }), ephemeral: true })
  }
}

export default UserAvatar
