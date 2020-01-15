import { Command } from 'discord-akairo'
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
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'amount',
          type: arg => {
            // Fail if arg is empty or not a number
            if (!arg || isNaN(arg)) return null
            // Attempt to parse amount as integer
            const amount = parseInt(arg)
            // Amount must be between 1-50
            if (amount < 1 || amount > 50) return null
            // Return amount
            return amount
          },
          description: 'The number of messages to delete. Max is 50.',
          prompt: {
            start: 'How many messages do you want to delete?',
            retry: 'Please enter a number between 1 and 50.'
          }
        },
        {
          id: 'author',
          type: 'relevant',
          description: 'The author of the messages you want to delete.',
          prompt: {
            start: 'Enter the username or ID of the author.',
            retry: 'Please enter a valid username or ID.',
            optional: true
          }
        }
      ]
    })
  }

  async exec (message, { amount, author }) {
    // Delete the message containing the command
    await message.delete()

    // If an author is provided, filter for messages by that author
    if (author) {
      try {
        // Fetch the requested number of messages from this channel
        const messages = await message.channel.fetchMessages()

        // Filter for messages by the provided author
        const filteredMessages = await messages.filter(message => message.author.id === author.id).first(amount)

        // Delete the messages
        return message.channel.bulkDelete(filteredMessages)
      } catch (error) {
        // Log the error for debugging
        log.error(error)

        // Notify the message author that message deletion failed
        return message.util.send('Failed to delete messages. Check the logs for more details.')
      }
    } else {
      // Fetch the requested number of messages from this channel
      return message.channel.bulkDelete(amount)
    }
  }
}

export default PurgeCommand
