import { Command } from 'discord-akairo'
import config from '../../config'
import _ from '../../utilities/Util'

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
        retry: 'Channel not found. Please enter a valid channel name, mention, or ID.',
        optional: true
      }
    }

    return { channel }
  }

  async exec (message, { channel }) {
    try {
      const permissions = channel.permissionOverwrites

      if (permissions.has(message.guild.id) && !permissions.get(message.guild.id).deny.has('SEND_MESSAGES')) {
        return message.util.send(`${message.channel === channel ? 'This channel' : channel} is already unlocked.`)
      }

      await channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: null })

      return message.channel.send(`${_.prefix('lock')} **The channel has been unlocked.**`)
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default UnlockChannelCommand
