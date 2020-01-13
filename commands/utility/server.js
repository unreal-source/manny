import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../quin.config.js'

class ServerInfoCommand extends Command {
  constructor () {
    super('server', {
      aliases: ['server'],
      category: 'Utility',
      description: {
        content: 'Get information about this Discord server.',
        usage: '!server'
      },
      channelRestriction: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    // Server object
    const guild = message.guild

    // Server icon
    const guildIcon = guild.iconURL

    // Vanity invite code
    const inviteCode = await guild.fetchVanityCode()

    // Human-friendly server creation date
    const creationDate = DateTime.fromISO(guild.createdAt.toISOString())

    // Total members
    const totalMembers = guild.memberCount

    // Online members
    const onlineMembers = guild.members.filter(member => member.presence.status === 'online').size

    // Initialize & populate embed
    const embed = this.client.util.embed()
    .setColor(config.embedColors.violet)
    .setTitle(guild.name)
    .setDescription(config.serverDescription)
    .setThumbnail(guildIcon)
    .addField('Creation Date', `${creationDate.toLocaleString(DateTime.DATE_SHORT)} ${creationDate.toLocaleString(DateTime.TIME_SIMPLE)} ${creationDate.offsetNameShort}`, true)
    .addField('Members', `${totalMembers} (${onlineMembers} online)`, true)
    .addField('Invite', `https://discord.gg/${inviteCode}`)

    // Send the embed
    return message.util.send({ embed })
  }
}

export default ServerInfoCommand
