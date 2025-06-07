import { ContainerBuilder, MessageFlags, PermissionFlagsBits, SeparatorBuilder, TextDisplayBuilder } from 'discord.js'
import { thousands } from '../utilities/number-util.js'

export default {
  interaction: 'slash',
  name: 'limits',
  description: 'Check the server\'s current member and presence limits.',
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  async execute ({ interaction }) {
    const guild = await interaction.guild.fetch()
    const membersCurrent = thousands(guild.approximateMemberCount)
    const membersLimit = guild.maximumMembers ? thousands(guild.maximumMembers) : 'Unknown'
    const presenceCurrent = thousands(guild.approximatePresenceCount)
    const presenceLimit = guild.maximumPresences ? thousands(guild.maximumPresences) : 'Unknown'

    return interaction.reply({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent('## Server Limits')
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing('Small')
              .setDivider(true)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(`**Members:** ${membersCurrent} / ${membersLimit}\n**Presences:** ${presenceCurrent} / ${presenceLimit}`)
          )
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    })
  }
}
