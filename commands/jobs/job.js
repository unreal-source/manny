import { Command, Argument, Flag } from 'discord-akairo'
import config from '../../quin.config.js'

class JobCommand extends Command {
  constructor () {
    super('job', {
      aliases: ['job'],
      prefix: '$',
      category: 'Job Board',
      description: {
        content: 'Post a job on the job board',
        usage: '$job'
      },
      channelRestriction: 'dm'
    })
  }

  async * args (message) {
    const compensation = yield {
      type: Argument.range('number', 1, 3, true),
      prompt: {
        start: 'How will the job be compensated?\n\n1. Paid\n2. Revenue Share\n3. Unpaid',
        retry: 'Please choose a number.'
      }
    }

    if (compensation !== 1) {
      await message.util.send('Please use the `$unpaid` command for posting unpaid gigs.')
      return Flag.cancel()
    }

    const type = yield {
      type: Argument.range('number', 1, 2, true),
      prompt: {
        start: 'Is this a permanent or contract position?\n\n1. Permanent\n2. Contract',
        retry: 'Please choose a number.'
      }
    }

    let length

    if (type === 2) {
      length = yield {
        prompt: {
          start: 'What is the length of the contract? Examples: 2 weeks, 3 months, 1 year'
        }
      }
    }

    const role = yield {
      prompt: {
        start: 'What is the role you want to fill? Examples: Environment Artist, Networking Engineer, Producer'
      }
    }

    const employer = yield {
      prompt: {
        start: 'What is the name of your company?'
      }
    }

    const location = yield {
      prompt: {
        start: 'Where is the company located? Say "Anywhere" if your company is 100% remote.'
      }
    }

    const remote = yield {
      prompt: {
        type: Argument.range('number', 1, 2, true),
        start: 'Is this job remote friendly?\n\n1. Yes\n2. No',
        retry: 'Please choose a number.'
      }
    }

    const responsibilities = yield {
      prompt: {
        start: 'List the responsibilities associated with this role.'
      }
    }

    const qualifications = yield {
      prompt: {
        start: 'List the qualifications for this role.'
      }
    }

    const apply = yield {
      prompt: {
        start: 'How can people apply for this position?'
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
          const content = 'Please review your post to make sure it is accurate.\n\n1. Send Post\n2. Start Over'
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

    return post.edit(`Posted by <@${message.author.id}>`, editedPost)
  }
}

export default JobCommand
