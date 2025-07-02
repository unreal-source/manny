import { MessageFlags, PermissionFlagsBits } from 'discord.js'
import ms from 'ms'

export default {
  interaction: 'slash',
  name: 'uptime',
  description: 'Check how long Manny has been online.',
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  async execute ({ interaction, client }) {
    const uptime = ms(client.uptime, { long: true })
    return interaction.reply({ content: `:stopwatch: I have been online for \`${uptime}\``, flags: MessageFlags.Ephemeral })
  }
}
