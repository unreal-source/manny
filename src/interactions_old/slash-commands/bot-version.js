import { SlashCommand } from 'hiei.js'
import { PermissionFlagsBits } from 'discord.js'
import metadata from '../../../package.json'
import log from '../../utilities/logger.js'

class BotVersion extends SlashCommand {
  constructor () {
    super({
      name: 'version',
      description: 'Check which version of the bot is running',
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild
    })
  }

  async run (interaction) {
    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ content: `Current version is \`${metadata.version}\``, ephemeral: true })
  }
}

export default BotVersion
