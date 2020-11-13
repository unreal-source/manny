import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../config'

class PortfolioCommand extends Command {
  constructor () {
    super('portfolio', {
      aliases: ['portfolio'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Post Portfolio',
        short: 'Post your portfolio and availability on the job board.',
        syntax: '$portfolio'
      },
      channel: 'dm',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
    })
  }

  async * args (message) {
    const type = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: '**Are you posting as an individual freelancer or a studio?**\n\nChoose one:\n**1. Freelancer**\n**2. Studio**',
        retry: 'Please enter one of the numbers above.'
      }
    }

    const name = yield {
      prompt: {
        start: type === 1 ? '**What is your name**?' : '**What is the name of your studio?**'
      }
    }

    const services = yield {
      type: Argument.validate('string', (message, value) => value.length < 1024),
      prompt: {
        start: '**List the services you offer. (Max 1024 characters)**',
        retry: (message, data) => `Your message has **${data.phrase.length}** characters, exceeding the 1024 character limit. Please try again.`
      }
    }

    const url = yield {
      type: 'url',
      prompt: {
        start: '**Enter the URL for your portfolio website.**\nExample: https://acmegames.com',
        retry: 'A portfolio URL is required.'
      }
    }

    const contact = yield {
      prompt: {
        start: '**How can prospective clients contact you?**'
      }
    }

    const embed = this.client.util.embed()
      .setTitle(name)
      .setDescription(url)
      .addField('Services', services)
      .addField('Contact', contact)

    const review = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: message => {
          const content = '**Almost there! Please review your post to make sure it\'s accurate.**\n\nChoose one:\n**1. Send Post**\n**2. Start Over**\n_ _'
          return { content, embed }
        },
        retry: 'Please enter one of the numbers above.'
      }
    }

    if (review === 2) {
      await message.util.send('OK. Run the command again to start a new post.')
      return Flag.cancel()
    }

    return { type, name, url, services, contact, embed }
  }

  async exec (message, { type, name, url, services, contact, embed }) {
    const channel = this.client.channels.cache.get(type === 1 ? config.jobs.channels.hireFreelancer : config.jobs.channels.hireStudio)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`ID - ${post.id}`)

    post.edit(`Posted by <@${message.author.id}>`, editedPost)

    return message.channel.send(`Your post was successfully added to the **#${channel.name}** channel.`)
  }
}

export default PortfolioCommand
