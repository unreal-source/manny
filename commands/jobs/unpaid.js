import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../quin.config.js'

class UnpaidCommand extends Command {
  constructor () {
    super('unpaid', {
      aliases: ['unpaid'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Post Unpaid Gig',
        content: 'Post an unpaid gig on the job board. This includes student projects, mods, and other volunteer gigs.',
        usage: '$unpaid'
      },
      channelRestriction: 'dm'
    })
  }

  async * args (message) {
    const title = yield {
      prompt: {
        start: 'Enter a title.'
      }
    }

    const description = yield {
      prompt: {
        start: 'Enter a description.'
      }
    }

    const contact = yield {
      prompt: {
        start: 'How can people contact you?'
      }
    }

    const embed = this.client.util.embed()
      .setColor(config.embedColors.violet)
      .setTitle(title)
      .setDescription(description)
      .addField('Contact', contact)

    const review = yield {
      type: Argument.range('numnber', 1, 2, true),
      prompt: {
        start: message => {
          const content = 'Please review your post to make sure it is accurate.\n\n1. Send Post\n2. Start Over'
          return { content, embed }
        },
        retry: 'Please choose a number.'
      }
    }

    if (review === 2) {
      await message.util.send('OK. The command the cancelled.')
      return Flag.cancel()
    }

    return { title, description, contact, embed }
  }

  async exec (message, { embed }) {
    const channel = this.client.channels.cache.get(config.jobChannels.unpaidGigs)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`POST ID: ${post.id}`)

    return post.edit(`Posted by <@${message.author.id}>`, editedPost)
  }
}

export default UnpaidCommand
