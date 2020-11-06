import { Command } from 'discord-akairo'
import Case from '../../models/cases'
import config from '../../config'
import _ from '../../utilities/Util'

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
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS'],
      flags: ['--logs', '-l']
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
    const history = await Case.findAll({
      where: { userID: user.id }
    })

    if (history.length !== 0) {
      const mutes = history.filter(infraction => infraction.action === 'mute')
      const strikes = history.filter(infraction => infraction.action === 'strike')
      const activeStrikes = strikes.filter(strike => strike.active === true)
      const bans = history.filter(infraction => infraction.action === 'ban')

      const reply = this.client.util.embed()
        .setAuthor('Infraction History for')
        .setTitle(`**${user.tag}**`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`${mutes.length} Mutes • ${strikes.length} Strikes (${activeStrikes.length} Active) • ${bans.length} Bans`)

      if (logs) {
        reply
          .addField(`${config.prefixes.mute} Mutes`, mutes.length === 0 ? 'None' : mutes.map((mute, index) => {
            return `**Muted for ${mute.duration} by ${mute.moderator}**\nReason: ${mute.reason}\n${_.prettyDate(mute.timestamp)}${index !== mutes.length - 1 ? '\n' : ''}`
          }))
          .addField(`${config.prefixes.strike} Strikes`, strikes.length === 0 ? 'None' : strikes.map((strike, index) => {
            return `**Strike added by ${strike.moderator}**\nReason: ${strike.reason}\n${_.prettyDate(strike.timestamp)}${index !== strikes.length - 1 ? '\n' : ''}`
          }))
          .addField(`${config.prefixes.ban} Bans`, bans.length === 0 ? 'None' : bans.map((ban, index) => {
            return `**Banned by ${ban.moderator}**\nReason: ${ban.reason}\n${_.prettyDate(ban.timestamp)}${index !== bans.length - 1 ? '\n' : ''}`
          }))
      }

      return message.channel.send({ embed: reply })
    }

    return message.channel.send(`${user.tag} has no infraction history`)
  }
}

export default UserHistoryCommand
