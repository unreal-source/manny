import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { time } from '@discordjs/builders'

class UserInfo extends SlashCommand {
  constructor () {
    super({
      name: 'user',
      description: 'Learn more about a user',
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: 'user',
          description: 'The user you want to learn about',
          required: true
        }
      ],
      defaultMemberPermissions: PermissionFlagsBits.BanMembers
    })
  }

  async run (interaction) {
    const member = interaction.options.getMember('user')
    const membership = member.pending ? 'Pending' : 'Confirmed'
    const roles = member.roles.cache.map(role => `\`${role.name}\``).join(' ')
    const joinedServer = `${time(member.joinedAt)} • ${time(member.joinedAt, 'R')}`
    const joinedDiscord = `${time(member.user.createdAt)} • ${time(member.user.createdAt, 'R')}`
    const status = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    }

    const info = new EmbedBuilder()
      .setTitle(`${member.user.tag} ${member.nickname ? `(${member.nickname})` : ''} ${member.user.bot ? '`BOT`' : ''}`)
      .setDescription(`**ID:** ${member.id}\n**Status:** ${status[member.presence.status]}\n**Membership:** ${membership}\n**Roles:** ${roles}\n**Joined Server:** ${joinedServer}\n**Joined Discord:** ${joinedDiscord}`)
      .setThumbnail(member.displayAvatarURL())

    return interaction.reply({ embeds: [info] })
  }
}

export default UserInfo
