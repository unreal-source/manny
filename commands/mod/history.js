import { Command } from 'discord-akairo'
import config from '../../config'

class UserHistoryCommand extends Command {
  constructor () {
    super('history', {
      aliases: ['history'],
      category: 'Moderator',
      description: {
        name: 'User History',
        content: 'Check a user\'s infraction history.',
        usage: '`!history <user>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const user = yield {
      type: 'user',
      prompt: {
        start: 'Who\'s infraction history do you want to check?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const logs = yield {
      match: 'flag',
      flag: ['--logs', '-l']
    }

    return { user, logs }
  }

  async exec (message, { user, logs }) {
    // Fetch all cases for this user
    // Filter and separate the mutes, strikes, active strikes, and bans
    // Build embed (show logs if flag is found)
    // Send embed
  }
}

export default UserHistoryCommand
