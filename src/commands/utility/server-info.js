import { SlashCommand } from 'hiei.js'
import { EmbedBuilder } from 'discord.js'
import { time } from '@discordjs/builders'
import { thousands } from '../../utilities/number-util.js'

class ServerInfo extends SlashCommand {
  constructor () {
    super({
      name: 'server',
      description: 'Learn more about the server'
    })
  }

  async run (interaction) {
    const boostTierName = {
      0: 'No boosts',
      1: 'Level 1',
      2: 'Level 2',
      3: 'Level 3'
    }

    const boostThreshold = {
      1: 2,
      2: 7,
      3: 14
    }

    const boostCount = interaction.guild.premiumSubscriptionCount > 0 ? `${interaction.guild.premiumSubscriptionCount} Boosts •` : ''
    const nextTier = boostCount < boostThreshold[3] ? `• ${boostThreshold[interaction.guild.premiumTier + 1] - boostCount} more until next level` : ''

    const totalMembers = interaction.guild.memberCount.toString()
    const onlineMembers = interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size.toString()

    const links = {
      donate: process.env.DONATE_LINK,
      github: process.env.GITHUB_LINK,
      twitter: process.env.TWITTER_LINK,
      website: process.env.WEBSITE_LINK
    }

    const info = new EmbedBuilder()
      .setTitle(interaction.guild.name)
      .setThumbnail(interaction.guild.iconURL())
      .addFields([
        { name: 'Members', value: thousands(totalMembers), inline: true },
        { name: 'Online', value: thousands(onlineMembers), inline: true },
        { name: 'Boost Status', value: `${boostTierName[interaction.guild.premiumTier]} ${boostCount} ${nextTier}` },
        { name: 'Created', value: `${time(interaction.guild.createdAt)} • ${time(interaction.guild.createdAt, 'R')}` },
        { name: 'Links', value: `[Website](${links.website}) • [Twitter](${links.twitter}) • [GitHub](${links.github}) • [Donate](${links.donate})` }])

    if (interaction.guild.description) {
      info.setDescription(interaction.guild.description)
    }

    if (interaction.guild.vanityURLCode) {
      info.addFields([{ name: 'Invite', value: `[discord.gg/${interaction.guild.vanityURLCode}](https://discord.gg/${interaction.guild.vanityURLCode})` }])
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
