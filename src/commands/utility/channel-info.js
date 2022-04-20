import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, MessageEmbed } from 'discord.js'
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
      GUILD_TEXT: 'Text',
      GUILD_VOICE: 'Voice',
      GUILD_CATEGORY: 'Category',
      GUILD_NEWS: 'Announcements',
      GUILD_STAGE_VOICE: 'Stage'
    }

    const info = new MessageEmbed()
      .addField('Type', capitalize(channelTypes[channel.type]), true)
      .addField('ID', channel.id, true)

    if (channel.parent) {
      info.addField('Category', capitalize(channel.parent.name))
    }

    switch (channel.type) {
      case 'GUILD_TEXT':
        info
          .setTitle(channel.name)
          .addField('Topic', channel.topic ? channel.topic : 'None')
          .addField('Created', `${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}`)

        if (channel.lastMessage) {
          info.addField('Last Used', `${time(channel.lastMessage.editedAt || channel.lastMessage.createdAt)} • ${time(channel.lastMessage.editedAt || channel.lastMessage.createdAt, 'R')}`)
        }

        break
      case 'GUILD_VOICE' || 'GUILD_STAGE_VOICE':
        info
          .setTitle(channel.name)
          .addField('Bitrate', `${channel.bitrate / 1000}kbps`)
          .addField('Users', channel.userLimit > 0 ? `${channel.members.size.toString()} / ${channel.userLimit}` : channel.members.size.toString())
          .addField('Created', `${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}`)

        break
      default:
        info
          .setTitle(channel.name)
          .addField('Created', `${time(channel.createdAt)} • ${time(channel.createdAt, 'R')}`)

        break
    }

    return interaction.reply({ embeds: [info] })
  }
}

export default ChannelInfo
