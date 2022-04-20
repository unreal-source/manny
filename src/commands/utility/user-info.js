import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, MessageEmbed } from 'discord.js'
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

    const info = new MessageEmbed()
      .setTitle(`${member.user.tag} ${member.nickname ? `(${member.nickname})` : ''} ${member.user.bot ? '`BOT`' : ''}`)
      .setThumbnail(member.displayAvatarURL())
      .addField('Status', status[member.presence.status], true)
      .addField('ID', member.id, true)
      .addField('Membership', member.pending ? 'Pending' : 'Confirmed')
      .addField('Roles', member.roles.cache.map(role => `\`${role.name}\``).join(' '))
      .addField('Joined Server', `${time(member.joinedAt)} • ${time(member.joinedAt, 'R')}`)
      .addField('Joined Discord', `${time(member.user.createdAt)} • ${time(member.user.createdAt, 'R')}`)

    return interaction.reply({ embeds: [info] })
  }
}

export default UserInfo
