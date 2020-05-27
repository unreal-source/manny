import { Command, Argument } from 'discord-akairo'
import config from '../../bot.config'
import log from '../../utilities/logger'

class PurgeCommand extends Command {
  constructor () {
    super('purge', {
      aliases: ['purge'],
      category: 'Moderation',
      description: {
        name: 'Purge Messages',
        content: 'Delete messages in bulk and optionally filter by author.',
        usage: '!purge <amount> [author]'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
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

    const member = yield {
      type: 'member',
      prompt: {
        start: 'Enter the @username or ID of the member.',
        retry: 'Please enter a valid membername or ID.',
        optional: true
      }
    }

    return { count, member }
  }

  async exec (message, { count, member }) {
    const logChannel = this.client.channels.cache.get(config.logChannels.modLog)

    // Delete the message containing the command
    await message.delete()

    // If member is provided, only delete messages from that member
    if (member) {
      try {
        const messages = await message.channel.messages.fetch()
        const filteredMessages = await messages.filter(message => message.author.id === member.id).first(count)

        await message.channel.bulkDelete(filteredMessages)

        return logChannel.send(`:broom: **${message.author.tag}** deleted **${count} ${count > 1 ? 'messages' : 'message'}** from **${member.user.tag}** in **#${message.channel.name}**.`)
      } catch (error) {
        log.error(error)

        return message.author.send('Failed to delete messages. Check the logs for more details.')
      }
    }

    await message.channel.bulkDelete(count)

    return logChannel.send(`:broom: **${message.author.tag}** deleted **${count} ${count > 1 ? 'messages' : 'message'}** in **#${message.channel.name}**.`)
  }
}

export default PurgeCommand
