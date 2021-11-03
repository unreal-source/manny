import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { time } from '@discordjs/builders'
import { thousands } from '../../../utilities/Util.js'

class ServerInfo extends SlashCommand {
  constructor () {
    super({
      name: 'server',
      description: 'Learn more about the server'
    })
  }

  async run (interaction) {
    const totalMembers = interaction.guild.memberCount.toString()
    const onlineMembers = interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size.toString()
    const boostTierNames = {
      TIER_1: 'Friends',
      TIER_2: 'Groups',
      TIER_3: 'Communities'
    }

    const boostThreshold = {
      1: 2,
      2: 7,
      3: 14
    }

    const boostCount = interaction.guild.premiumSubscriptionCount
    const currentTier = interaction.guild.premiumTier
    const nextTier = boostCount < boostThreshold[3] ? `${boostThreshold[currentTier + 1] - boostCount} boosts until ${boostTierNames[currentTier + 1]}` : ''

    const info = new MessageEmbed()
      .setTitle(interaction.guild.name)
      .setDescription(interaction.guild.description ? interaction.guild.description : '')
      .setThumbnail(interaction.guild.iconURL())
      .addField('Members', thousands(totalMembers), true)
      .addField('Online', thousands(onlineMembers), true)
      .addField('Boost Status', currentTier === 'NONE' ? 'No boosts' : `${boostTierNames[currentTier]} • ${boostCount} Boosts • ${nextTier}`)
      .addField('Created', `${time(interaction.guild.createdAt)} • ${time(interaction.guild.createdAt, 'R')}`)

    if (interaction.guild.vanityURLCode) {
      info.addField('Invite', `[discord.gg/${interaction.guild.vanityURLCode}](https://discord.gg/${interaction.guild.vanityURLCode})`)
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
