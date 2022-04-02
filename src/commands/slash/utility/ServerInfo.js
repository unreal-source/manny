import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { time } from '@discordjs/builders'
import { thousands } from '../../../utilities/util.js'

class ServerInfo extends SlashCommand {
  constructor () {
    super({
      name: 'server',
      description: 'Learn more about the server'
    })
  }

  async run (interaction) {
    const boostTierName = {
      NONE: 'No boosts',
      TIER_1: 'Level 1',
      TIER_2: 'Level 2',
      TIER_3: 'Level 3'
    }

    const boostTierNumber = {
      NONE: 0,
      TIER_1: 1,
      TIER_2: 2,
      TIER_3: 3
    }

    const boostThreshold = {
      1: 2,
      2: 7,
      3: 14
    }

    const boostCount = interaction.guild.premiumSubscriptionCount > 0 ? `${interaction.guild.premiumSubscriptionCount} Boosts •` : ''
    const currentTier = boostTierNumber[interaction.guild.premiumTier]
    const nextTier = boostCount < boostThreshold[3] ? `• ${boostThreshold[currentTier + 1] - boostCount} more until next level` : ''

    const totalMembers = interaction.guild.memberCount.toString()
    const onlineMembers = interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size.toString()

    const links = {
      donate: process.env.DONATE_LINK,
      github: process.env.GITHUB_LINK,
      twitter: process.env.TWITTER_LINK,
      website: process.env.WEBSITE_LINK
    }

    const info = new MessageEmbed()
      .setTitle(interaction.guild.name)
      .setDescription(interaction.guild.description ? interaction.guild.description : '')
      .setThumbnail(interaction.guild.iconURL())
      .addField('Members', thousands(totalMembers), true)
      .addField('Online', thousands(onlineMembers), true)
      .addField('Boost Status', `${boostTierName[interaction.guild.premiumTier]} ${boostCount} ${nextTier}`)
      .addField('Created', `${time(interaction.guild.createdAt)} • ${time(interaction.guild.createdAt, 'R')}`)
      .addField('Links', `[Website](${links.website}) • [Twitter](${links.twitter}) • [GitHub](${links.github}) • [Donate](${links.donate})`)

    if (interaction.guild.vanityURLCode) {
      info.addField('Invite', `[discord.gg/${interaction.guild.vanityURLCode}](https://discord.gg/${interaction.guild.vanityURLCode})`)
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
