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
      if (channel.permissionOverwrites.get(channel.guild.id).deny.has('VIEW_CHANNEL')) {
        return message.util.send(`${channel} is unaffected by locks because it's restricted.`)
      }

      if (!channel.permissionOverwrites.get(channel.guild.id).deny.has('SEND_MESSAGES')) {
        await channel.updateOverwrite(channel.guild.roles.everyone, {
          SEND_MESSAGES: false
        })

        if (message.channel !== channel) {
          message.util.send(`${config.prefixes.lock} ${channel} is now locked.`)
        }

        return channel.send(`${config.prefixes.lock} **Channel locked**`)
      } else {
        return message.util.send(`${message.channel === channel ? 'This channel' : channel} is already locked.`)
      }
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default LockChannelCommand
