import { Command, Argument } from 'discord-akairo'
import log from '../../util/logger.js'

class PurgeCommand extends Command {
  constructor () {
    super('purge', {
      aliases: ['purge'],
      category: 'Moderation',
      description: {
        content: 'Delete messages in bulk and optionally filter by author.',
        usage: '!purge <amount> [author]'
      },
      channelRestriction: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const count = yield {
      type: Argument.range('number', 1, 50, true),
      prompt: {
        start: 'How many messages do you want to delete?',
        retry: 'Please enter a number between 1 and 50.'
      }
    }

    const author = yield {
      type: 'member',
      prompt: {
        start: 'Enter the username or ID of the author.',
        retry: 'Please enter a valid username or ID.',
        optional: true
      }
    }

    return { count, author }
  }

  async exec (message, { count, author }) {
    // Get mod log channel
    const logChannel = await this.client.channels.cache.find(channel => channel.name === this.client.config.modLogChannel)

    // Delete the message containing the command
    await message.delete()

    // If an author is provided, filter for messages by that author
    if (author) {
      try {
        // Fetch the requested number of messages from this channel
        const messages = await message.channel.messages.fetch()

        // Filter for messages by the provided author
        const filteredMessages = await messages.filter(message => message.author.id === author.id).first(count)

        // Delete the messages
        await message.channel.bulkDelete(filteredMessages)

        // Log action
        return logChannel.send(`:x: **${message.author.username}** deleted ${count} ${count > 1 ? 'messages' : 'message'} from **${author.tag}** in ${message.channel}.`)
      } catch (error) {
        // Log the error for debugging
        log.error(error)

        // Notify the message author that message deletion failed
        return message.util.send('Failed to delete messages. Check the logs for more details.')
      }
    } else {
      // Fetch the requested number of messages from this channel
      await message.channel.bulkDelete(count)

      // Log action
      return logChannel.send(`:x: **${message.author.tag}** deleted ${count} ${count > 1 ? 'messages' : 'message'} in ${message.channel}.`)
    }
  }
}

export default PurgeCommand
