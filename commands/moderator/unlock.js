import { Command } from 'discord-akairo'

class UnlockChannelCommand extends Command {
  constructor () {
    super('unlock', {
      aliases: ['unlock'],
      category: 'Moderator',
      description: {
        name: 'Unlock Channel',
        content: 'Lift read-only restriction on a channel',
        usage: '!unlock [channel]'
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
        message.util.send(`:unlock: ${channel} is now unlocked.`)
      }

      return channel.send(':unlock: **Channel unlocked**')
    } else {
      return message.util.send(`${message.channel === channel ? 'This channel' : channel} is already unlocked.`)
    }
  }
}

export default UnlockChannelCommand
