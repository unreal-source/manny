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
        content: 'Post an unpaid gig on the job board.',
        usage: '$unpaid'
      },
      channelRestriction: 'dm'
    })
  }

  async * args (message) {
    const title = yield {
      prompt: {
        start: '__**Add a title that clearly states what you\'re looking for.**__\nExample: Character Artist Needed for Mod Project'
      }
    }

    const description = yield {
      prompt: {
        start: '__**Add a detailed description of the project and your needs.**__\n'
      }
    }

    const contact = yield {
      prompt: {
        start: '__**How can people contact you?**__'
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
          const content = '__**Review your post to make sure it\'s accurate.**__\nPlease choose a number.\n\n**1. Send Post**\n**2. Start Over**\n_ _'
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

    post.edit(`Posted by <@${message.author.id}>`, editedPost)

    return message.util.send(`Your post has been added to **#${channel.name}**.`)
  }
}

export default UnpaidCommand
