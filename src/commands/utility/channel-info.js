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
      9: 'Stage'
    }

    const info = new EmbedBuilder()
      .setTitle(channel.name)
      .addFields([
        { name: 'Type', value: channelTypes[channel.type], inline: true },
        { name: 'ID', value: channel.id, inline: true }])

    if (channel.parent) {
      info.addFields([{ name: 'Category', value: capitalize(channel.parent.name) }])
    }

    if (channel.isText()) {
      info.addFields([{ name: 'Topic', value: channel.topic ?? 'None' }])

      if (channel.lastMessage) {
        info.addFields([{ name: 'Latest Activity', value: `${time(channel.lastMessage.editedAt || channel.lastMessage.createdAt)} • ${time(channel.lastMessage.editedAt || channel.lastMessage.createdAt, 'R')}` }])
      }
    }

    if (channel.isVoice()) {
      info
        .addFields([
          { name: 'Bitrate', value: `${channel.bitrate / 1000}kbps` },
          { name: 'Users', value: channel.userLimit > 0 ? `${channel.members.size.toString()} / ${channel.userLimit}` : channel.members.size.toString() }])
    }

    if (channel.isStage()) {
      info
        .addFields([
          { name: 'Bitrate', value: `${channel.bitrate / 1000}kbps` },
          { name: 'Users', value: channel.userLimit > 0 ? `${channel.members.size.toString()} / ${channel.userLimit}` : channel.members.size.toString() }])
    }

    if (channel.isCategory()) {
      info.addFields([{ name: 'Channels', value: channel.children.cache.size.toString() }])
    }

    info.addFields([{ name: 'Created', value: `${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}` }])

    return interaction.reply({ embeds: [info] })
  }
}

export default ChannelInfo
