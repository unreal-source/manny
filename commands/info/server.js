import { Command } from 'discord-akairo'
import config from '../../config'
import _ from '../../utilities/Util'

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
    const totalMembers = _.thousands(message.guild.memberCount)
    const onlineMembers = _.thousands(message.guild.members.cache.filter(member => member.presence.status === 'online').size)
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
      .setTitle(`**${message.guild.name}**`)
      .setDescription(message.guild.description ? message.guild.description : 'Guild description goes here')
      .setThumbnail(message.guild.iconURL())
      .addField('Members', totalMembers, true)
      .addField('Online', onlineMembers, true)
      .addField('Server Boost', `${premiumTier[message.guild.premiumTier]} • ${message.guild.premiumSubscriptionCount} Boosts • ${premiumThreshold[message.guild.premiumTier + 1] - message.guild.premiumSubscriptionCount} boosts until ${premiumTier[message.guild.premiumTier + 1]}`)
      .addField('Created', _.prettyDate(message.guild.createdAt))
      .addField('Links', `[Website](${config.meta.links.website}) • [Twitter](${config.meta.links.twitter}) • [GitHub](${config.meta.links.github})`)

    if (message.guild.vanityURLCode) {
      embed.addField('Invite', `[discord.gg/${message.guild.vanityURLCode}](https://discord.gg/${message.guild.vanityURLCode})`)
    }

    return message.util.send({ embed })
  }
}

export default ServerInfoCommand
