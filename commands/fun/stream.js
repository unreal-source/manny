import { Command } from 'discord-akairo'
import config from '../../config'
import Case from '../../models/cases'
import { DateTime } from 'luxon'
import _ from '../../utilities/Util'

class StreamCommand extends Command {
  constructor () {
    super('stream', {
      aliases: ['stream'],
      category: 'Fun',
      description: {
        name: 'Stream',
        short: 'Request permission to stream in a voice channel.',
        syntax: '!stream'
      },
      channel: 'dm',
      clientPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    try {
      const member = this.client.guilds.cache.first().member(message.author)
      const now = DateTime.local()
      const joinedServer = DateTime.fromJSDate(member.joinedAt)
      const timeSinceJoin = now.diff(joinedServer, 'days').toObject()
      const timeUntilEligible = joinedServer.plus({ days: 7 })
      const strikes = await Case.findAll({
        where: {
          action: 'strike',
          userID: member.id,
          active: true
        },
        order: [['timestamp', 'DESC']]
      })

      const strikeCount = strikes.length

      if (timeSinceJoin.days < 7) {
        return message.channel.send(`${_.prefix('warning')} You are not eligible for streaming until **${_.prettyDate(timeUntilEligible.toJSDate())}**.`)
      }

      if (strikeCount === 0) {
        if (member.roles.cache.some(role => role.id === config.roles.stream)) {
          return message.channel.send(`${_.prefix('warning')} You are already able to stream in the **${member.voice.channel.name}** voice channel.`)
        }

        if (member.voice.channel !== null) {
          await member.roles.add(config.roles.stream)
          this.client.log.info(`Streaming role added >> ${member.user.tag}`)
          return message.channel.send(`${_.prefix('success')} You may now stream in the **${member.voice.channel.name}** voice channel.`)
        } else {
          return message.channel.send(`${_.prefix('warning')} Please join the voice channel you want to stream in, then try again.`)
        }
      }

      return message.channel.send(`${_.prefix('warning')} You are not eligible for streaming until **${_.prettyStrikeExpiration(strikes[0].timestamp)}**.`)
    } catch (e) {
      await message.channel.send(`${_.prefix('error')} Something went wrong. Please notify a moderator.`)
      return this.client.log.error(e)
    }
  }
}

export default StreamCommand
