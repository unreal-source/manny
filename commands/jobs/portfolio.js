import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../bot.config'

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
        start: '__**Are you posting as an individual freelancer or a studio?**__\nPlease choose a number.\n\n**1. Freelancer**\n**2. Studio**',
        retry: 'Please choose a number.'
      }
    }

    const name = yield {
      prompt: {
        start: type === 1 ? '__**What is your name**__?' : '__**What is the name of your studio?**__'
      }
    }

    const services = yield {
      type: Argument.validate('string', (message, value) => value.length < 1024),
      prompt: {
        start: '__**List the services you offer.**__',
        retry: (message, data) => `Your message has **${data.phrase.length}** characters, exceeding the **1024** character limit. Please try again.`
      }
    }

    const url = yield {
      type: 'url',
      prompt: {
        start: '__**Enter the URL for your portfolio website.**__\nExample: https://acmegames.com',
        retry: 'A portfolio URL is required.'
      }
    }

    const contact = yield {
      prompt: {
        start: '__**How can prospective clients contact you?**__'
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

    return { type, name, url, services, contact, embed }
  }

  async exec (message, { type, name, url, services, contact, embed }) {
    const channel = this.client.channels.cache.get(type === 1 ? config.jobChannels.hireFreelancer : config.jobChannels.hireStudio)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`POST ID: ${post.id}`)

    post.edit(`Posted by <@${message.author.id}>`, editedPost)

    return message.util.send(`Your post has been added to **#${channel.name}**.`)
  }
}

export default PortfolioCommand
