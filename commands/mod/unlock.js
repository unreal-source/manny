import { Command } from 'discord-akairo'
import config from '../../config'

class UnlockChannelCommand extends Command {
  constructor () {
    super('unlock', {
      aliases: ['unlock'],
      category: 'Moderator',
      description: {
        name: 'Unlock Channel',
        short: 'Unlock a channel so regular members can send messages again.',
        syntax: '!unlock channel',
        args: {
          channel: 'The channel you want to unlock. Can be a name, mention, or ID.'
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
        start: 'Which channel do you want to unlock?',
        retry: 'Channel not found. Please enter a valid channel name, mention, or ID.',
        optional: true
      }
    }

    return { channel }
  }

  async exec (message, { channel }) {
    if (channel.permissionOverwrites.get(channel.guild.id).deny.has('VIEW_CHANNEL')) {
      return message.util.send(`${channel} is unaffected by locks because it's restricted.`)
    }

    if (channel.permissionOverwrites.get(channel.guild.id).deny.has('SEND_MESSAGES')) {
      await channel.updateOverwrite(channel.guild.roles.everyone, {
        SEND_MESSAGES: null
      })

      if (message.channel !== channel) {
        message.util.send(`${config.prefixes.unlock} ${channel} is now unlocked.`)
      }

      return channel.send(`${config.prefixes.unlock} **Channel unlocked**`)
    } else {
      return message.util.send(`${message.channel === channel ? 'This channel' : channel} is already unlocked.`)
    }
  }
}

export default UnlockChannelCommand
