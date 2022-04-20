import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { time } from '@discordjs/builders'

class RoleInfo extends SlashCommand {
  constructor () {
    super({
      name: 'role',
      description: 'Learn more about a role',
      options: [
        {
          type: 'ROLE',
          name: 'role',
          description: 'The role you want to learn about',
          required: true
        }
      ]
    })
  }

  async run (interaction) {
    const role = interaction.options.getRole('role')
    const info = new MessageEmbed()
      .setColor(role.hexColor)
      .setTitle(role.name)
      .addField('Color', role.hexColor, true)
      .addField('\u200b', '\u200b', true)
      .addField('ID', role.id, true)
      .addField('Members', role.members.size.toString(), true)
      .addField('\u200b', '\u200b', true)
      .addField('Mentionable', role.mentionable ? 'Yes' : 'No', true)
      .addField('Created', `${time(role.createdAt)} • ${time(role.createdAt, 'R')}`)

    return interaction.reply({ embeds: [info] })
  }
}

export default RoleInfo
