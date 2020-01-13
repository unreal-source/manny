import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../quin.config.js'

class UserInfoCommand extends Command {
  constructor () {
    super('user', {
      aliases: ['user'],
      category: 'Utility',
      description: {
        content: 'Get information about a user.',
        usage: '!user [@username or ID]'
      },
      channelRestriction: 'guild',
      userPermissions: ['SEND_MESSAGES'],
      args: [
        {
          id: 'member',
          type: 'member',
          description: 'The member you want to look up. Can be a username or ID.',
          default: message => message.member,
          prompt: {
            start: 'Which user do you want to look up?',
            retry: 'Please enter a valid username or ID.',
            optional: true
          }
        }
      ]
    })
  }

  async exec (message, { member }) {
    // Get avatar
    const avatar = await member.user.displayAvatarURL

    // Human-friendly date when this user joined Discord
    const discordJoinDate = DateTime.fromISO(member.user.createdAt.toISOString())
    
    // Human-friendly date when this user joined the guild
    const guildJoinDate = DateTime.fromISO(member.joinedAt.toISOString())

    // Human-friendly date when this user's last message was sent
    const lastMessageDate = DateTime.fromISO(member.lastMessage.createdAt.toISOString())

    // Human-friendly statuses
    const status = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    }

    // Initialize & populate embed
    const embed = this.client.util.embed()
    .setColor(config.embedColors.violet)
    .setThumbnail(avatar)
    .setTitle(member.user.bot ? `${member.displayName} :robot:` : member.displayName)
    .addField('Username', member.user.tag, true)
    .addField('User ID', member.id, true)
    .addField('Status', status[member.presence.status], true)
    .addField(`Joined Server`, `${guildJoinDate.toLocaleString(DateTime.DATE_SHORT)} ${guildJoinDate.toLocaleString(DateTime.TIME_SIMPLE)} ${guildJoinDate.offsetNameShort}`)
    .addField('Joined Discord', `${discordJoinDate.toLocaleString(DateTime.DATE_SHORT)} ${discordJoinDate.toLocaleString(DateTime.TIME_SIMPLE)} ${discordJoinDate.offsetNameShort}`)
    .addField('Last Seen', `${lastMessageDate.toLocaleString(DateTime.DATE_SHORT)} ${lastMessageDate.toLocaleString(DateTime.TIME_SIMPLE)} ${lastMessageDate.offsetNameShort}`)

    // Send embed
    return message.util.send({ embed })
  }
}

export default UserInfoCommand
