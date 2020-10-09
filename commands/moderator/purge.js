import { Command, Argument } from 'discord-akairo'
import config from '../../config'

class PurgeCommand extends Command {
  constructor () {
    super('purge', {
      aliases: ['purge'],
      category: 'Moderator',
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

    const author = yield {
      type: 'member',
      prompt: {
        start: 'Enter the @username or ID of the member.',
        retry: 'Please enter a valid membername or ID.',
        optional: true
      }
    }

    return { count, author }
  }

  async exec (message, { count, author }) {
    try {
      const logChannel = await this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setTitle(`${config.prefixes.purge} ${count} ${count > 1 ? 'messages' : 'message'} deleted`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Channel', `#${message.channel.name}`)
        .setTimestamp()

      await message.delete()

      if (author) {
        try {
          const messages = await message.channel.messages.fetch()
          const filteredMessages = await messages.filter(message => message.author.id === author.id).first(count)

          await message.channel.bulkDelete(filteredMessages)

          logEntry.addField('Author', author.user.tag)

          return logChannel.send({ embed: logEntry })
        } catch (error) {
          this.client.log.error(error)

          return message.author.send('Failed to delete messages. Check the logs for more details.')
        }
      }

      await message.channel.bulkDelete(count)

      return logChannel.send({ embed: logEntry })
    } catch (err) {
      return this.client.log.error(err)
    }
  }
}

export default PurgeCommand
