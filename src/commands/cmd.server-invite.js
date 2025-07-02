import { PermissionFlagsBits } from 'discord.js'

export default {
  interaction: 'slash',
  name: 'invite',
  description: 'Get this server\'s invite link',
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  async execute ({ interaction }) {
    return interaction.reply({ content: `https://discord.gg/${interaction.guild.vanityURLCode}` })
  }
}
