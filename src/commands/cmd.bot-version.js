import { ContainerBuilder, MessageFlags, PermissionFlagsBits, TextDisplayBuilder } from 'discord.js'
import metadata from '../../package.json'

export default {
  interaction: 'slash',
  name: 'version',
  description: 'Check which version of Manny is currently running.',
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  async execute ({ interaction }) {
    // return interaction.reply({ content: `Currently running version \`${metadata.version}\``, flags: MessageFlags.Ephemeral })
    return interaction.reply({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Currently running version \`${metadata.version}\``))
      ], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    })
  }
}
