import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../quin.config'

class ServerInfoCommand extends Command {
  constructor () {
    super('server', {
      aliases: ['server'],
      category: 'Utility',
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
    const creationDate = DateTime.fromISO(guild.createdAt.toISOString())
    const totalMembers = guild.memberCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const onlineMembers = guild.members.cache.filter(member => member.presence.status === 'online').size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

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
      .setColor(config.embedColors.violet)
      .setTitle(guild.name)
      .setDescription(guild.description ? message.guild.description : '')
      .setThumbnail(guild.iconURL())
      .addField('Members', totalMembers, true)
      .addField('Online', onlineMembers, true)
      .addField('Server Boost', `${premiumTier[guild.premiumTier]} • ${guild.premiumSubscriptionCount} Boosts • ${premiumThreshold[guild.premiumTier + 1] - guild.premiumSubscriptionCount} boosts until ${premiumTier[guild.premiumTier + 1]}`)
      .addField('Created On', creationDate.toLocaleString(DateTime.DATE_FULL))
      .addField('Website', config.links.website)
      .addField('GitHub', config.links.github)
      .addField('Twitter', config.links.twitter)

    return message.util.send({ embed })
  }
}

export default ServerInfoCommand
