import { SlashCommand } from 'hiei.js'
import { PermissionFlagsBits } from 'discord.js'
import log from '../../utilities/logger.js'

class ServerInvite extends SlashCommand {
  constructor () {
    super({
      name: 'invite',
      description: 'Get the server\'s invite link',
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })
    return interaction.reply({ content: `https://discord.gg/${interaction.guild.vanityURLCode}` })
  }
}

export default ServerInvite
