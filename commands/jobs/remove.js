import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../quin.config'

class RemoveCommand extends Command {
  constructor () {
    super('remove', {
      aliases: ['remove'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Remove Post',
        content: 'Remove your post from the job board',
        usage: '$remove <post ID>'
      },
      channelRestriction: 'dm'
    })
  }

  async * args (message) {
    const post = yield {
      type: async (message, phrase) => {
        if (!phrase) return null

        const guild = this.client.guilds.cache.first()
        const category = guild.channels.cache.get(config.jobChannels.category)

        for (const channel of category.children.values()) {
          try {
            return await channel.messages.fetch(phrase)
          } catch (err) {
            continue
          }
        }

        return null
      },
      prompt: {
        start: 'Enter the ID of the post you want to remove. You can find the ID in the footer of the post.',
        retry: 'Post not found. Please try again.'
      }
    }

    let review

    if (post.content.includes(message.author.id)) {
      review = yield {
        type: Argument.range('number', 1, 2, true),
        prompt: {
          start: message => {
            const content = `__**Remove this post from #${post.channel.name}?**__\nPlease choose a number.\n\n**1. Remove Post**\n**2. Cancel**\n_ _`
            const embed = post.embeds[0]
            return { content, embed }
          },
          retry: 'Please choose a number.'
        }
      }
    } else {
      await message.util.send('You cannot remove that post.')
      return Flag.cancel()
    }

    if (review === 2) {
      await message.util.send('OK. The command was cancelled.')
      return Flag.cancel()
    }

    return { post, review }
  }

  async exec (message, { post }) {
    await post.delete()
    return message.util.send(`Your post was removed from **#${post.channel.name}**.`)
  }
}

export default RemoveCommand
