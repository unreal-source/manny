import { Command } from 'discord-akairo'
import config from '../../config'

class LockChannelCommand extends Command {
  constructor () {
    super('lock', {
      aliases: ['lock'],
      category: 'Moderator',
      description: {
        name: 'Lock Channel',
        short: 'Lock a channel so regular members can\'t send messages.',
        syntax: '!lock channel',
        args: {
          channel: 'The channel you want to lock. Can be a name, mention, or ID.'
        }
      },
      channel: 'guild',
      clientPermissions: ['MANAGE_CHANNELS', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_CHANNELS']
    })
  }

  * args () {
    const channel = yield {
      type: 'channel',
      default: message => message.channel,
      prompt: {
        retry: 'Channel not found. Please enter a channel name, mention, or ID.',
        optional: true
      }
    }

    return { channel }
  }

  async exec (message, { channel }) {
    try {
      const permissions = channel.permissionOverwrites

      if (permissions.has(message.guild.id) && permissions.get(message.guild.id).deny.has('SEND_MESSAGES')) {
        return message.util.send(`${message.channel === channel ? 'This channel' : channel} is already locked.`)
      }

      await channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false })

      return message.channel.send(`${config.prefixes.lock} **The channel has been locked.**`)
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default LockChannelCommand
