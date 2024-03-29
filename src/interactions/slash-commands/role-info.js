import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { SlashCommand } from 'hiei.js'
import { time } from '@discordjs/builders'
import log from '../../utilities/logger.js'

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
      ],
      defaultMemberPermissions: PermissionFlagsBits.BanMembers
    })
  }

  async run (interaction) {
    const role = interaction.options.getRole('role')
    const members = role.members.size.toString()
    const mentionable = role.mentionable ? 'Yes' : 'No'
    const created = `${time(role.createdAt)} • ${time(role.createdAt, 'R')}`
    const info = new EmbedBuilder()
      .setColor(role.hexColor)
      .setTitle(role.name)
      .setDescription(`**ID:** ${role.id}\n**Color:** ${role.hexColor}\n**Members:** ${members}\n**Mentionable:** ${mentionable}\n**Created:** ${created}`)

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ embeds: [info], ephemeral: true })
  }
}

export default RoleInfo
