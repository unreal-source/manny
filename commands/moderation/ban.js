import { Command } from 'discord-akairo'
import config from '../../quin.config.js'
import log from '../../util/logger.js'

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      category: 'Moderation',
      description: {
        name: 'Ban User',
        content: 'Ban a user from the server.',
        usage: '!ban <user> <reason>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const user = yield {
      type: 'user',
      prompt: {
        start: 'Which user do you want to ban?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you banning this user?',
        retry: 'Please add a reason for this ban.'
      }
    }

    return { user, reason }
  }

  async exec (message, { user, reason }) {
    // TODO: Integrate with mod log
    if (user.id === message.author.id) {
      return message.channel.send(':warning: Why would you ban yourself?')
    }

    if (user.id === this.client.user.id) {
      return message.channel.send(':warning: Was it something I said?')
    }

    if (message.guild.members.cache.some(member => member.user.id === user.id)) {
      const member = await message.guild.members.fetch(user)

      if (member.roles.highest.position >= message.member.roles.highest.position) {
        return message.channel.send('You cannot ban this user.')
      }

      if (!member.bannable) {
        return message.channel.send('I am unable to ban this user.')
      }
    }

    const banned = await message.guild.members.ban(user, { reason: reason })
    return message.channel.send(`You banned ${banned} from the server.`)
  }
}

export default BanCommand
