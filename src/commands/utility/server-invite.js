import { SlashCommand } from 'hiei.js'
import { PermissionFlagsBits } from 'discord.js'

class ServerInvite extends SlashCommand {
  constructor () {
    super({
      name: 'invite',
      description: 'Get the server\'s invite link',
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    return interaction.reply({ content: `https://discord.gg/${interaction.guild.vanityURLCode}` })
  }
}

export default ServerInvite
