import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../config'

class RemoveCommand extends Command {
  constructor () {
    super('remove', {
      aliases: ['remove'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Remove Post',
        short: 'Remove a post from the job board.',
        syntax: '$remove post',
        args: {
          post: 'The ID of the post you want to remove.'
        }
      },
      channel: 'dm',
      clientPermissions: ['MANAGE_MESSAGES', 'EMBED_LINKS', 'SEND_MESSAGES']
    })
  }

  async * args (message) {
    const post = yield {
      type: 'job',
      prompt: {
        start: 'Enter the ID of the post you want to remove. You can find the ID at the bottom of your post.',
        retry: 'Post not found. Please enter the ID for one of your posts.'
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
