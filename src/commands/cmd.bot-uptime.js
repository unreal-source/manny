import { ContainerBuilder, MessageFlags, PermissionFlagsBits, TextDisplayBuilder } from 'discord.js'
import ms from 'ms'

export default {
  interaction: 'slash',
  name: 'uptime',
  description: 'Check how long Manny has been online.',
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  async execute ({ interaction, client }) {
    const uptime = ms(client.uptime, { long: true })
    return interaction.reply({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Manny has been online for **${uptime}**`))
      ], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    })
  }
}
