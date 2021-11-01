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
    const total = interaction.guild.memberCount.toString()
    const online = interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size.toString()
    const boostLevel = {
      TIER_1: 'Level 1',
      TIER_2: 'Level 2',
      TIER_3: 'Level 3'
    }

    const boostThreshold = {
      1: 2,
      2: 7,
      3: 14
    }

    const nextLevel = interaction.guild.premiumSubscriptionCount < boostThreshold[3] ? `${boostThreshold[interaction.guild.premiumTier + 1] - interaction.guild.premiumSubscriptionCount} boosts until ${boostLevel[interaction.guild.premiumTier + 1]}` : ''

    const info = new MessageEmbed()
      .setTitle(interaction.guild.name)
      .setDescription(interaction.guild.description ? interaction.guild.description : '')
      .setThumbnail(interaction.guild.iconURL())
      .addField('Members', thousands(total), true)
      .addField('Online', thousands(online), true)
      .addField('Server Boost', interaction.guild.premiumTier === 'NONE' ? 'None' : `${boostLevel[interaction.guild.premiumTier]} • ${interaction.guild.premiumSubscriptionCount} Boosts • ${nextLevel}`)
      .addField('Created', time(interaction.guild.createdAt))

    if (interaction.guild.vanityURLCode) {
      info.addField('Invite', `[discord.gg/${interaction.guild.vanityURLCode}](https://discord.gg/${interaction.guild.vanityURLCode})`)
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ServerInfo
