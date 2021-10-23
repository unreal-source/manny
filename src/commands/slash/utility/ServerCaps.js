import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { thousands } from '../../../utilities/Util.js'

class ServerCaps extends SlashCommand {
  constructor () {
    super({
      name: 'caps',
      description: 'Check the server\'s member and presence caps'
    })
  }

  async run (interaction) {
    const guild = await interaction.guild.fetch()
    const embed = new MessageEmbed()
      .addField('Maximum Members', thousands(guild.maximumMembers))
      .addField('Maximum Presences', thousands(guild.maximumPresences))

    return interaction.reply({ embeds: [embed], ephemeral: true })
  }
}

export default ServerCaps
