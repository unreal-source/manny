import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { SlashCommand } from 'hiei.js'
import { time } from '@discordjs/builders'

class RoleInfo extends SlashCommand {
  constructor () {
    super({
      name: 'role',
      description: 'Learn more about a role',
      options: [
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role',
          description: 'The role you want to learn about',
          required: true
        }
      ]
    })
  }

  async run (interaction) {
    const role = interaction.options.getRole('role')
    const info = new EmbedBuilder()
      .setColor(role.hexColor)
      .setTitle(role.name)
      .addFields([
        { name: 'Color', value: role.hexColor, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: 'ID', value: role.id, inline: true },
        { name: 'Members', value: role.members.size.toString(), inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: `${time(role.createdAt)} • ${time(role.createdAt, 'R')}` }])

    return interaction.reply({ embeds: [info] })
  }
}

export default RoleInfo
