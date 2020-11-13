import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../config'

class RemoveCommand extends Command {
  constructor () {
    super('remove', {
      aliases: ['remove'],
      prefix: config.commands.jobPrefix,
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
            const content = `**Remove this post from the #${post.channel.name} channel?**\n\nChoose one:\n**1. Remove my post**\n**2. Cancel**\n_ _`
            const embed = post.embeds[0]
            return { content, embed }
          },
          retry: 'Please enter one of the numbers above.'
        }
      }
    } else {
      await message.util.send('You can\'t remove that post because it was made by another user.')
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
    return message.channel.send(`Your post was successfully removed from the **#${post.channel.name}** channel.`)
  }
}

export default RemoveCommand
