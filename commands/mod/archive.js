import { Command } from 'discord-akairo'
import config from '../../config'

class ArchiveChannelCommand extends Command {
  constructor () {
    super('archive', {
      aliases: ['archive'],
      category: 'Moderator',
      description: {
        name: 'Archive Channel',
        short: 'Send a channel to the Archives category.',
        long: 'Send a channel to the Archives category. Using the command with no arguments will archive the current channel.',
        syntax: '!archive channel',
        args: {
          channel: 'The channel you want to archive.'
        }
      },
      channel: 'guild',
      clientPermissions: ['MANAGE_CHANNELS', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_CHANNELS']
    })
  }

  * args () {
    const channel = yield {
      type: 'channel',
      default: message => message.channel,
      prompt: {
        start: 'Which channel do you want to archive?',
        retry: 'Channel not found. Please enter a valid channel name, mention, or ID.',
        optional: true
      }
    }

    const confirm = yield {
      type: ['yes', 'y'],
      prompt: {
        start: `Are you sure you want to archive ${channel}?`,
        retry: 'Say **yes** to archive the channel or **cancel** to do nothing.'
      }
    }

    return { channel, confirm }
  }

  async exec (message, { channel, confirm }) {
    if (confirm) {
      await channel.setParent(config.archive.category)
      await channel.lockPermissions()
      return message.channel.send(`${config.prefixes.archive} ${channel} has been archived.`)
    }
  }
}

export default ArchiveChannelCommand
