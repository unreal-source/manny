import { SlashCommand } from 'hiei.js'
import { EmbedBuilder } from 'discord.js'
import { thousands } from '../../utilities/number-util.js'

class ServerCaps extends SlashCommand {
  constructor () {
    super({
      name: 'caps',
      description: 'Check the server\'s member and presence caps'
    })
  }

  async run (interaction) {
    const guild = await interaction.guild.fetch()
    const embed = new EmbedBuilder()
      .addFields(
        { name: 'Maximum Members', value: thousands(guild.maximumMembers) },
        { name: 'Maximum Presences', value: thousands(guild.maximumPresences) })

    return interaction.reply({ embeds: [embed], ephemeral: true })
  }
}

export default ServerCaps
