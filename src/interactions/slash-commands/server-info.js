import { SlashCommand } from 'hiei.js'
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { time } from '@discordjs/builders'
import { thousands } from '../../utilities/number-util.js'
import log from '../../utilities/logger.js'

class ServerInfo extends SlashCommand {
  constructor () {
    super({
      name: 'server',
      description: 'Learn more about the server',
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    const guild = await interaction.guild.fetch()
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

    const boostCount = guild.premiumSubscriptionCount > 0 ? `${guild.premiumSubscriptionCount} Boosts •` : ''
    const nextTier = boostCount < boostThreshold[3] ? `• ${boostThreshold[guild.premiumTier + 1] - boostCount} more until next level` : ''
    const boostStatus = `${boostTierName[guild.premiumTier]} ${boostCount} ${nextTier}`
    const description = guild.description ? `${guild.description}\n—` : ''
    const totalMembers = guild.approximateMemberCount.toString()
    const onlineMembers = guild.approximatePresenceCount.toString()
    const created = `${time(guild.createdAt)} • ${time(guild.createdAt, 'R')}`
    const links = `[Website](${process.env.WEBSITE_LINK}) • [Twitter](${process.env.TWITTER_LINK}) • [GitHub](${process.env.GITHUB_LINK}) • [Donate](${process.env.DONATE_LINK})`
    const invite = guild.vanityURLCode ? `\n**Invite:** [discord.gg/${guild.vanityURLCode}](https://discord.gg/${guild.vanityURLCode})` : ''

    const info = new EmbedBuilder()
      .setTitle(guild.name)
      .setDescription(`${description}\n**Members:** ${thousands(totalMembers)} • ${thousands(onlineMembers)} online\n**Boost Status:** ${boostStatus}\n**Created:** ${created}${invite}\n—\n${links}`)
      .setThumbnail(guild.iconURL())

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
