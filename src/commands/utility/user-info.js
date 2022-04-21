import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
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
      ]
    })
  }

  async run (interaction) {
    const member = interaction.options.getMember('user')
    const status = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    }

    const info = new EmbedBuilder()
      .setTitle(`${member.user.tag} ${member.nickname ? `(${member.nickname})` : ''} ${member.user.bot ? '`BOT`' : ''}`)
      .setThumbnail(member.displayAvatarURL())
      .addFields(
        { name: 'Status', value: status[member.presence.status], inline: true },
        { name: 'ID', value: member.id, inline: true },
        { name: 'Membership', value: member.pending ? 'Pending' : 'Confirmed' },
        { name: 'Roles', value: member.roles.cache.map(role => `\`${role.name}\``).join(' ') },
        { name: 'Joined Server', value: `${time(member.joinedAt)} • ${time(member.joinedAt, 'R')}` },
        { name: 'Joined Discord', value: `${time(member.user.createdAt)} • ${time(member.user.createdAt, 'R')}` })

    return interaction.reply({ embeds: [info] })
  }
}

export default UserInfo
