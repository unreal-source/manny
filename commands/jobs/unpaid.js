import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../config'

class UnpaidCommand extends Command {
  constructor () {
    super('unpaid', {
      aliases: ['unpaid'],
      prefix: config.commands.jobPrefix,
      category: 'Job Board',
      description: {
        name: 'Post Unpaid Gig',
        short: 'Post an unpaid gig on the job board.',
        syntax: '$unpaid'
      },
      channel: 'dm',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
    })
  }

  async * args (message) {
    const title = yield {
      type: Argument.validate('string', (message, value) => value.length < 256),
      prompt: {
        start: '**Add a title that clearly states what you\'re looking for.**\nExample: Character Artist Needed for Mod Project',
        retry: (message, data) => `Your title has **${data.phrase.length}** characters, exceeding the 256 character limit. Please try again.`
      }
    }

    const description = yield {
      type: Argument.validate('string', (message, value) => value.length < 2048),
      prompt: {
        start: '**Add a detailed description of the project and your needs.**',
        retry: (message, data) => `Your description has **${data.phrase.length}** characters, exceeding the 2048 character limit. Please try again.`
      }
    }

    const contact = yield {
      prompt: {
        start: '**How can people contact you?**'
      }
    }

    const embed = this.client.util.embed()
      .setTitle(title)
      .setDescription(description)
      .addField('Contact', contact)

    const review = yield {
      type: Argument.range('numnber', 1, 2, true),
      prompt: {
        start: message => {
          const content = '**Almost there! Please review your post to make sure it\'s accurate.**\n\nChoose one:\n**1. Send my post**\n**2. Start over**\n_ _'
          return { content, embed }
        },
        retry: 'Please choose a number.'
      }
    }

    if (review === 2) {
      await message.util.send('OK. Run the command again to start a new post.')
      return Flag.cancel()
    }

    return { title, description, contact, embed }
  }

  async exec (message, { embed }) {
    const channel = this.client.channels.cache.get(config.jobs.channels.unpaidGigs)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`ID - ${post.id}`)

    post.edit(`Posted by <@${message.author.id}>`, editedPost)

    return message.channel.send(`Your post was successfully added to the **#${channel.name}** channel.`)
  }
}

export default UnpaidCommand
