import { Listener } from 'discord-akairo'
import config from '../../config'
import { CronJob } from 'cron'
import { DateTime } from 'luxon'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'
import _ from '../../utilities/Util'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.guilds.cache.each(guild => this.client.log.success(`${this.client.user.username} successfully connected to ${guild.name}`))
    this.client.user.setActivity('the server • !help', { type: 'WATCHING' })

    let currentMemberCount = this.client.guilds.cache.first().memberCount

    const job = new CronJob('0 */1 * * * *', async () => {
      const guild = this.client.guilds.cache.first()
      const now = DateTime.local()

      // ----- MUTE SCHEDULE ----- //
      try {
        const mutes = await Mute.findAll()
        const expiredMutes = mutes.filter(mute => mute.expiration <= now)

        for (const mute of expiredMutes) {
          await Mute.destroy({
            where: { id: mute.id }
          })

          const logChannel = this.client.channels.cache.get(config.channels.logs.modLog)
          const logEntry = this.client.util.embed()
            .setColor(_.color('yellow'))
            .setAuthor(mute.user)
            .setTitle(`${_.prefix('expired')} Mute expired`)
            .setTimestamp()

          await logChannel.send({ embed: logEntry })

          const member = await guild.member(mute.id)

          if (member) {
            const muteRole = await guild.roles.fetch(config.roles.muted)
            await member.roles.remove(muteRole)

            const receipt = this.client.util.embed()
              .setColor(_.color('yellow'))
              .setAuthor(guild.name, guild.iconURL())
              .setTitle(`${_.prefix('expired')} Your mute expired`)
              .setDescription('You may now send messages in the server again.')
              .setTimestamp()

            member.send({ embed: receipt })
          }
        }
      } catch (e) {
        this.client.log.error(e)
      }

      // ----- STRIKE SCHEDULE ----- //
      try {
        const strikes = await Strike.findAll()
        const expiredStrikes = strikes.filter(strike => strike.expiration <= now)

        for (const strike of expiredStrikes) {
          await Strike.destroy({
            where: { id: strike.id }
          })

          const record = await Case.update({ active: false }, {
            where: { id: strike.id }
          })

          const activeStrikes = await Case.count({
            where: {
              userID: record.userID,
              active: true
            }
          })

          const logChannel = this.client.channels.cache.get(config.channels.logs.modLog)
          const logEntry = this.client.util.embed()
            .setColor(_.color('orange'))
            .setAuthor(record.user)
            .setTitle(`${_.prefix('expired')} Strike expired`)
            .setDescription(activeStrikes === 0 ? 'No active strikes' : `${activeStrikes} strikes remaining`)
            .setTimestamp()

          await logChannel.send({ embed: logEntry })

          const member = await guild.member(record.userID)

          if (member) {
            const receipt = this.client.util.embed()
              .setColor(_.color('orange'))
              .setAuthor(guild.name, guild.iconURL())
              .setTitle(`${_.prefix('expired')} Strike expired`)
              .setDescription(activeStrikes === 0 ? 'No active strikes' : `${activeStrikes} strikes remaining`)
              .setTimestamp()

            member.send({ embed: receipt })
          }
        }
      } catch (e) {
        this.client.log.error(e)
      }

      // ----- AUTOMOD ----- //
      const latestMemberCount = this.client.guilds.cache.first().memberCount
      const difference = latestMemberCount - currentMemberCount

      if (difference >= config.automod.joinCount) {
        const notifChannel = this.client.channels.cache.get(config.channels.automod.notifications)
        notifChannel.send(`<@&${config.roles.moderator}> **${difference} new members joined the server in the last 1 minute.**`)
      }

      currentMemberCount = latestMemberCount
    }, /* onComplete */ null, /* start */ null, /* timezone */ null, /* context */ null, /* runOnInit */ true)

    job.start()
  }
}

export default ReadyListener
