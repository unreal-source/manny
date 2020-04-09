import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../quin.config.js'

class JobCommand extends Command {
  constructor () {
    super('job', {
      aliases: ['job'],
      prefix: '$',
      category: 'Job Board',
      description: {
        name: 'Post Job',
        content: 'Post a paid job opportunity on the job board',
        usage: '$job'
      },
      channelRestriction: 'dm'
    })
  }

  async * args (message) {
    const compensation = yield {
      type: Argument.range('number', 1, 3, true),
      prompt: {
        start: '__**How will the job be compensated?**__\nPlease choose a number.\n\n**1. Paid**\n**2. Revenue Share**\n**3. Unpaid**',
        retry: 'Please choose a number.'
      }
    }

    if (compensation !== 1) {
      await message.util.send('This command is for paid job opportunities. For hobby projects or jobs with deferred payment, please use the `$unpaid` command.')
      return Flag.cancel()
    }

    const type = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: '__**Is this a permanent or contract position?**__\nPlease choose a number.\n\n**1. Permanent**\n**2. Contract**',
        retry: 'Please choose a number.'
      }
    }

    let length

    if (type === 2) {
      length = yield {
        prompt: {
          start: '__**What is the length of the contract?**__\nExamples: 2 weeks, 3 months, 1 year'
        }
      }
    }

    const role = yield {
      prompt: {
        start: '__**What is the role you want to fill?**__\nExamples: Environment Artist, Networking Engineer, Producer'
      }
    }

    const employer = yield {
      prompt: {
        start: '__**What is the name of your company?**__'
      }
    }

    const location = yield {
      prompt: {
        start: '__**Where is the company located?**__\nSay "Anywhere" if your company is completely remote and/or has no physical headquarters.'
      }
    }

    const remote = yield {
      prompt: {
        type: Argument.range('number', 1, 2, true),
        start: '__**Is this job remote friendly?**__\nPlease choose a number.\n\n**1. Yes**\n**2. No**',
        retry: 'Please choose a number.'
      }
    }

    const responsibilities = yield {
      type: Argument.validate('string', (message, value) => value.length < 1024),
      prompt: {
        start: '__**List the responsibilities associated with this role.**__\n',
        retry: (message, data) => `Your message has **${data.phrase.length}** characters, exceeding the **1024** character limit. Please try again.`
      }
    }

    const qualifications = yield {
      type: Argument.validate('string', (message, value) => value.length < 1024),
      prompt: {
        start: '__**List the qualifications for this role.**__',
        retry: (message, data) => `Your message has **${data.phrase.length}** characters, exceeding the **1024** character limit. Please try again.`
      }
    }

    const apply = yield {
      prompt: {
        start: '__**How can people apply for this position?**__'
      }
    }

    const embed = this.client.util.embed()
      .setColor(this.client.config.embedColors.violet)
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
          const content = '__**Review your post to make sure it\'s accurate.**__\nPlease choose a number.\n\n**1. Send Post**\n**2. Start Over**\n_ _'
          return { content, embed }
        },
        retry: 'Please choose a number.'
      }
    }

    if (review === 2) {
      await message.util.send('OK. The command was cancelled.')
      return Flag.cancel()
    }

    return { compensation, type, length, role, employer, location, remote, responsibilities, qualifications, apply, review, embed }
  }

  async exec (message, { type, embed }) {
    const channel = this.client.channels.cache.get(type === 1 ? config.jobChannels.permanentJobs : config.jobChannels.contractJobs)
    const post = await channel.send(embed)
    const editedPost = embed.setFooter(`POST ID: ${post.id}`)

    post.edit(`Posted by <@${message.author.id}>`, editedPost)

    return message.util.send(`Your post has been added to **#${channel.name}**.`)
  }
}

export default JobCommand
