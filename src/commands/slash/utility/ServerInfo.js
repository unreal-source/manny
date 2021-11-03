import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { time } from '@discordjs/builders'
import { thousands } from '../../../utilities/Util.js'
import { links } from '../../../manny.config.js'

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
      TIER_1: 'Friends',
      TIER_2: 'Groups',
      TIER_3: 'Communities'
    }

    const boostTierNumber = {
      NONE: 0,
      TIER_1: 1,
      TIER_2: 2,
      TIER_3: 3
    }

    const emojiBoost = this.client.emojis.cache.find(e => e.name === 'boost').toString()
    const emojiBoostEmpty = this.client.emojis.cache.find(e => e.name === 'boost_empty').toString()
    const boostTierEmoji = {
      NONE: `${emojiBoostEmpty} ${emojiBoostEmpty} ${emojiBoostEmpty}`,
      TIER_1: `${emojiBoost} ${emojiBoostEmpty} ${emojiBoostEmpty}`,
      TIER_2: `${emojiBoost} ${emojiBoost} ${emojiBoostEmpty}`,
      TIER_3: `${emojiBoost} ${emojiBoost} ${emojiBoost}`
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

    const info = new MessageEmbed()
      .setTitle(interaction.guild.name)
      .setDescription(interaction.guild.description ? interaction.guild.description : '')
      .setThumbnail(interaction.guild.iconURL())
      .addField('Members', thousands(totalMembers), true)
      .addField('Online', thousands(onlineMembers), true)
      .addField('Boost Status', `${boostTierEmoji[interaction.guild.premiumTier]} ${boostTierName[interaction.guild.premiumTier]} ${boostCount} ${nextTier}`)
      .addField('Created', `${time(interaction.guild.createdAt)} • ${time(interaction.guild.createdAt, 'R')}`)
      .addField('Links', `[Website](${links.website}) • [Twitter](${links.twitter}) • [GitHub](${links.github})`)

    if (interaction.guild.vanityURLCode) {
      info.addField('Invite', `[discord.gg/${interaction.guild.vanityURLCode}](https://discord.gg/${interaction.guild.vanityURLCode})`)
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
