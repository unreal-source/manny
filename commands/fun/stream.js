import { Command } from 'discord-akairo'
import config from '../../config'
import Case from '../../models/cases'
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
      const strikes = await Case.findAll({
        where: {
          action: 'strike',
          userID: member.id,
          active: true
        },
        order: [['timestamp', 'DESC']]
      })

      const strikeCount = strikes.length

      // Add the stream role if the user is in a voice channel and has no active strikes
      if (strikeCount === 0) {
        if (member.voice.channel !== null) {
          await member.roles.add(config.roles.stream)
          this.client.log.info(`Streaming role added >> ${member.user.tag}`)
          return message.channel.send(`You may now stream in the **${member.voice.channel.name}** voice channel.`)
        } else {
          return message.channel.send(':warning: Please join the voice channel you want to stream in, then try again.')
        }
      }

      return message.channel.send(`:warning: You are not eligible for streaming until **${_.prettyStrikeExpiration(strikes[0].timestamp)}**.`)
    } catch (e) {
      await message.channel.send('Something went wrong. Please notify a moderator.')
      return this.client.log.error(e)
    }
  }
}

export default StreamCommand
