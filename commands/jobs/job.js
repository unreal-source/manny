import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../config'

class JobCommand extends Command {
  constructor () {
    super('job', {
      aliases: ['job'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Post Job',
        short: 'Post a paid job opportunity on the job board.',
        syntax: '$job'
      },
      channel: 'dm',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
    })
  }

  async * args (message) {
    const compensation = yield {
      type: Argument.range('number', 1, 3, true),
      prompt: {
        start: '**How will the job be compensated?**\n\nChoose one:\n**1. Paid**\n**2. Revenue share**\n**3. Unpaid**',
        retry: 'Please enter one of the numbers above.'
      }
    }

    if (compensation !== 1) {
      await message.util.send('For hobby projects or jobs with deferred payment, please use the `$unpaid` command.')
      return Flag.cancel()
    }

    const type = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: '**Is this a permanent or contract position?**\n\nChoose one:\n**1. Permanent**\n**2. Contract**',
        retry: 'Please enter one of the numbers above.'
      }
    }

    let length

    if (type === 2) {
      length = yield {
        prompt: {
          start: '**What is the length of the contract?**\nExamples: 2 weeks, 3 months, 1 year'
        }
      }
    }

    const role = yield {
      prompt: {
        start: '**What role are you hiring for?**\nExamples: Environment Artist, Networking Engineer, Producer'
      }
    }

    const employer = yield {
      prompt: {
        start: '**What is the name of your company?**'
      }
    }

    const location = yield {
      prompt: {
        start: '**Where is the company located?**\nSay "Anywhere" if your company is completely remote and/or has no physical headquarters.'
      }
    }

    const remote = yield {
      prompt: {
        type: Argument.range('number', 1, 2, true),
        start: '**Is this job remote friendly?**\n\nChoose one:\n\n**1. Yes**\n**2. No**',
        retry: 'Please enter one of the numbers above.'
      }
    }

    const responsibilities = yield {
      type: Argument.validate('string', (message, value) => value.length < 1024),
      prompt: {
        start: '**List the responsibilities associated with this role. (Max 1024 characters)**',
        retry: (message, data) => `Your message has **${data.phrase.length}** characters, exceeding the 1024 character limit. Please try again.`
      }
    }

    const qualifications = yield {
      type: Argument.validate('string', (message, value) => value.length < 1024),
      prompt: {
        start: '**List the qualifications for this role. (Max 1024 characters)**',
        retry: (message, data) => `Your message has **${data.phrase.length}** characters, exceeding the 1024 character limit. Please try again.`
      }
    }

    const apply = yield {
      prompt: {
        start: '**How can people apply for this position?**'
      }
    }

    const embed = this.client.util.embed()
      .setTitle(`${role} at ${employer}`)
      .setDescription(remote === '1' ? ':globe_with_meridians: Remote Friendly' : '')
      .addField('Location', location, true)

    if (type === 2) {
      embed.addField('Contract Length', length, true)
    }

    embed
      .addField('Responsibilities', responsibilities)
      .addField('Qualifications', qualifications)
      .addField('How To Apply', apply)

    const review = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: message => {
          const content = '**Almost there! Please review your post to make sure it\'s accurate.**\n\nChoose one:\n**1. Send my post**\n**2. Start over**\n_ _'
          return { content, embed }
        },
        retry: 'Please enter one of the numbers above.'
      }
    }

    if (review === 2) {
      await message.util.send('OK. Run the command again to start a new post.')
      return Flag.cancel()
    }

    return { compensation, type, length, role, employer, location, remote, responsibilities, qualifications, apply, review, embed }
  }

  async exec (message, { type, embed }) {
    const channel = this.client.channels.cache.get(type === 1 ? config.jobs.channels.permanentJobs : config.jobs.channels.contractJobs)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`ID - ${post.id}`)

    post.edit(`Posted by <@${message.author.id}>`, editedPost)

    return message.channel.send(`Your post was successfully added to the **#${channel.name}** channel.`)
  }
}

export default JobCommand
