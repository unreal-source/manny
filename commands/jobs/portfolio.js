import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../quin.config.js'

class PortfolioCommand extends Command {
  constructor () {
    super('portfolio', {
      aliases: ['portfolio'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Post Portfolio',
        content: 'Post your portfolio on the job board',
        usage: '$portfolio'
      },
      channelRestriction: 'dm'
    })
  }

  async * args (message) {
    const type = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: 'Are you posting as an individual freelancer or a studio?\n\n1. Freelancer\n2. Studio',
        retry: 'Please choose a number.'
      }
    }

    const name = yield {
      prompt: {
        start: type === 1 ? 'What is your name?' : 'What is the name of your studio?'
      }
    }

    const services = yield {
      prompt: {
        start: 'List the services you offer.'
      }
    }

    const url = yield {
      type: 'url',
      prompt: {
        start: 'Add a URL to your portfolio website.',
        retry: 'A portfolio URL is required.'
      }
    }

    const contact = yield {
      prompt: {
        start: 'How can prospective clients contact you?'
      }
    }

    const embed = this.client.util.embed()
      .setColor(config.embedColors.violet)
      .setTitle(name)
      .setDescription(url)
      .addField('Services', services)
      .addField('Contact', contact)

    const review = yield {
      type: Argument.range('number', 1, 2, true),
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

    return { type, name, url, services, contact, embed }
  }

  async exec (message, { type, name, url, services, contact, embed }) {
    const channel = this.client.channels.cache.get(type === 1 ? config.jobChannels.hireFreelancer : config.jobChannels.hireStudio)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`POST ID: ${post.id}`)

    return post.edit(`Posted by <@${message.author.id}>`, editedPost)
  }
}

export default PortfolioCommand
