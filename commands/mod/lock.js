import { Command } from 'discord-akairo'
import config from '../../config'

class LockChannelCommand extends Command {
  constructor () {
    super('lock', {
      aliases: ['lock'],
      category: 'Moderator',
      description: {
        name: 'Lock Channel',
        content: 'Make a channel read-only for regular members',
        usage: '!lock [channel]'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const channel = yield {
      type: 'channel',
      default: message => message.channel,
      prompt: {
        start: 'Which channel do you want to lock?',
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
  }
}

export default LockChannelCommand
