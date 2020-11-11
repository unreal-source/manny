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
        retry: 'Channel not found. Please enter a channel name, mention, or ID.',
        optional: true
      }
    }

    const confirm = yield {
      type: 'confirm',
      prompt: {
        start: `Are you sure you want to archive ${channel}?`,
        retry: 'Say **yes** to archive the channel or **no** to cancel.'
      }
    }

    return { channel, confirm }
  }

  async exec (message, { channel, confirm }) {
    try {
      if (confirm) {
        await channel.setParent(config.archive.category)
        await channel.lockPermissions()
        return message.util.send(`${config.prefixes.archive} ${channel} has been archived.`)
      }
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default ArchiveChannelCommand
