import { SlashCommand } from 'hiei.js'
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { thousands } from '../../utilities/number-util.js'

class ServerCaps extends SlashCommand {
  constructor () {
    super({
      name: 'caps',
      description: 'Check the server\'s member and presence caps',
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild
    })
  }

  async run (interaction) {
    const guild = await interaction.guild.fetch()
    const maxMembers = guild.maximumMembers ? thousands(guild.maximumMembers) : 'Unknown'
    const maxPresences = guild.maximumPresences ? thousands(guild.maximumPresences) : 'Unknown'
    const embed = new EmbedBuilder()
      .setDescription(`**Maximum Members:** ${maxMembers}\n**Maximum Presences:** ${maxPresences}`)

    return interaction.reply({ embeds: [embed], ephemeral: true })
  }
}

export default ServerCaps
