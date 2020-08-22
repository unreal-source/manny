import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../bot.config'

class ServerInfoCommand extends Command {
  constructor () {
    super('server', {
      aliases: ['server'],
      category: 'Info',
      description: {
        name: 'Server Info',
        content: 'Get information about this Discord server.',
        usage: '!server'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    const guild = await message.guild.fetch()
    const creationDate = DateTime.fromISO(message.guild.createdAt.toISOString())
    const totalMembers = message.guild.memberCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const onlineMembers = message.guild.members.cache.filter(member => member.presence.status === 'online').size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    const premiumTier = {
      0: 'No Level',
      1: 'Level 1',
      2: 'Level 2',
      3: 'Level 3'
    }

    const premiumThreshold = {
      1: 2,
      2: 15,
      3: 30
    }

    const embed = this.client.util.embed()
      .setColor(config.embedColors.gray)
      .setTitle(message.guild.name)
      .setDescription(message.guild.description ? message.guild.description : 'Guild description goes here')
      .setThumbnail(message.guild.iconURL())
      .addField('Members', totalMembers, true)
      .addField('Online', onlineMembers, true)
      .addField('Server Boost', `${premiumTier[message.guild.premiumTier]} • ${message.guild.premiumSubscriptionCount} Boosts • ${premiumThreshold[message.guild.premiumTier + 1] - message.guild.premiumSubscriptionCount} boosts until ${premiumTier[message.guild.premiumTier + 1]}`)
      .addField('Created On', creationDate.toLocaleString(DateTime.DATE_FULL))
      .addField('Links', `[Website](${config.links.website}) • [Twitter](${config.links.twitter}) • [GitHub](${config.links.github})`)
    
      if (message.guild.vanityURLCode) {
        embed.addField('Invite', `[discord.gg/${message.guild.vanityURLCode}](https://discord.gg/${message.guild.vanityURLCode})`)
      }

    return message.util.send({ embed })
  }
}

export default ServerInfoCommand
