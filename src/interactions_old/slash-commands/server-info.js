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
    const boostStatus = `${boostTierName[interaction.guild.premiumTier]} ${boostCount} ${nextTier}`
    const description = interaction.guild.description ? `${interaction.guild.description}\n—` : ''
    const totalMembers = interaction.guild.memberCount.toString()
    const onlineMembers = interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size.toString()
    const created = `${time(interaction.guild.createdAt)} • ${time(interaction.guild.createdAt, 'R')}`
    const links = `[Website](${process.env.WEBSITE_LINK}) • [Twitter](${process.env.TWITTER_LINK}) • [GitHub](${process.env.GITHUB_LINK}) • [Donate](${process.env.DONATE_LINK})`
    const invite = interaction.guild.vanityURLCode ? `\n**Invite:** [discord.gg/${interaction.guild.vanityURLCode}](https://discord.gg/${interaction.guild.vanityURLCode})` : ''

    const info = new EmbedBuilder()
      .setTitle(interaction.guild.name)
      .setDescription(`${description}\n**Members:** ${thousands(totalMembers)} • ${thousands(onlineMembers)} online\n**Boost Status:** ${boostStatus}\n**Created:** ${created}${invite}\n—\n${links}`)
      .setThumbnail(interaction.guild.iconURL())

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
