import { ContainerBuilder, MessageFlags, PermissionFlagsBits, TextDisplayBuilder } from 'discord.js'
import metadata from '../../../package.json' with { type: 'json' }

export default {
  interaction: 'slash',
  name: 'version',
  description: 'Check which version of Manny is currently running.',
  permissions: PermissionFlagsBits.BanMembers,
  execute (interaction) {
    return interaction.reply({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Currently running version \`${metadata.version}\``))
      ], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    })
  }
}
