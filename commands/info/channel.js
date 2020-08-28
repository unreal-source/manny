import { Command } from 'discord-akairo'
import config from '../../bot.config'
import capitalize from '../../utilities/capitalize'
import formatDate from '../../utilities/formatDate'

class ChannelInfoCommand extends Command {
  constructor () {
    super('channel', {
      aliases: ['channel'],
      category: 'Info',
      description: {
        name: 'Channel Info',
        content: 'Get information about a channel',
        usage: '!channel [channel]'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  * args () {
    const channel = yield {
      type: 'channel',
      match: 'rest',
      default: message => message.channel,
      prompt: {
        start: 'Which channel do you want to look up?',
        retry: 'Channel not found. Please enter a valid channel name, mention, or ID.',
        optional: true
      }
    }

    return { channel }
  }

  exec (message, { channel }) {
    const embed = this.client.util.embed()
      .setColor(config.embedColors.gray)
      .setTitle('Channel Info')
      .addField('Type', capitalize(channel.type), true)
      .addField('ID', channel.id, true)

    if (channel.parent) {
      embed.addField('Category', capitalize(channel.parent.name))
    }

    switch (channel.type) {
      case 'text':
        embed
          .setDescription(`#${channel.name}`)
          .addField('Topic', channel.topic ? channel.topic : 'None')
          .addField('Created', formatDate(channel.createdAt))

        if (channel.lastMessage) {
          embed.addField('Last Activity', formatDate(channel.lastMessage.editedAt || channel.lastMessage.createdAt))
        }
        break
      case 'voice':
        embed
          .setDescription(channel.name)
          .addField('Bitrate', `${channel.bitrate / 1000}kbps`)
          .addField('Users', channel.userLimit > 0 ? `${channel.members.size} / ${channel.userLimit}` : channel.members.size)
          .addField('Created', formatDate(channel.createdAt))
        break
      default:
        embed
          .setDescription(channel.name)
          .addField('Created', formatDate(channel.createdAt))
        break
    }

    return message.util.send({ embed })
  }
}

export default ChannelInfoCommand
