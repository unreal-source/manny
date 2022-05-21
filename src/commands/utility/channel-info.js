import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { time } from '@discordjs/builders'
import { capitalize } from '../../utilities/string-util.js'

class ChannelInfo extends SlashCommand {
  constructor () {
    super({
      name: 'channel',
      description: 'Learn more about a channel',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel you want to learn about',
          required: true
        }
      ]
    })
  }

  async run (interaction) {
    const channel = interaction.options.getChannel('channel')
    const channelTypes = {
      0: 'Text',
      2: 'Voice',
      4: 'Category',
      5: 'News',
      13: 'Stage'
    }

    const category = `**Category:** ${channel.parent ? capitalize(channel.parent.name) : 'None'}\n`
    const info = new EmbedBuilder()

    if (channel.isText()) {
      const latestActivity = channel.lastMessage ? `**Latest Activity:** ${time(channel.lastMessage.editedAt || channel.lastMessage.createdAt)} • ${time(channel.lastMessage.editedAt || channel.lastMessage.createdAt, 'R')}\n` : ''

      info
        .setTitle(`#${channel.name}`)
        .setDescription(`**ID:** ${channel.id}\n**Type:** ${channelTypes[channel.type]}\n${category}**Topic:** ${channel.topic ?? 'None'}\n${latestActivity}**Created:** ${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}`)
    }

    if (channel.isVoice() || channel.isStage()) {
      const users = channel.userLimit > 0 ? `${channel.members.size.toString()} / ${channel.userLimit}` : channel.members.size.toString()

      info
        .setTitle(channel.name)
        .setDescription(`**ID:** ${channel.id}\n**Type:** ${channelTypes[channel.type]}\n${category}**Bitrate:** ${channel.bitrate / 1000}kbps\n**Users:** ${users}\n**Created:** ${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}`)
    }

    if (channel.isCategory()) {
      info
        .setTitle(`${channel.name}`)
        .setDescription(`**ID:** ${channel.id}\n**Type:** ${channelTypes[channel.type]}\n**Channels:** ${channel.children.cache.size.toString()}\n**Created:** ${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}`)
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ChannelInfo
