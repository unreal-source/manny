import { Listener } from 'discord-akairo'
import config from '../../config'
import { CronJob } from 'cron'
import { DateTime } from 'luxon'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'
import { Signale } from 'signale'

const muteLog = new Signale({
  scope: 'Mute Schedule'
})

const strikeLog = new Signale({
  scope: 'Strike Schedule'
})

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.guilds.cache.each(guild => this.client.log.success(`${this.client.user.username} successfully connected to ${guild.name}`))

    this.client.user.setActivity('the server • !help', {
      type: 'WATCHING'
    })

    const job = new CronJob('0 */1 * * * *', async () => {
      const guild = this.client.guilds.cache.first()
      const now = DateTime.local()

      // ----- MUTE SCHEDULE ----- //
      try {
        const mutes = await Mute.findAll()

        if (mutes.length === 0) {
          muteLog.debug('No mutes scheduled')
        }

        for (const mute of mutes) {
          muteLog.debug(`Mute scheduled to expire at ${mute.expiration.toLocaleString(DateTime.DATETIME_FULL)}`)
        }

        const expiredMutes = mutes.filter(mute => mute.expiration <= now)

        for (const mute of expiredMutes) {
          await Mute.destroy({
            where: { id: mute.id }
          })

          const member = await guild.member(mute.id)

          if (member) {
            const muteRole = await guild.roles.fetch(config.infractions.muteRole)
            await member.roles.remove(muteRole)

            const receipt = this.client.util.embed()
              .setColor(config.embeds.colors.yellow)
              .setAuthor(guild.name, guild.iconURL())
              .setTitle(`${config.prefixes.expired} Your mute expired`)
              .setDescription('You may now send messages in the server again.')
              .setTimestamp()

            member.send({ embed: receipt })
          }
        }
      } catch (e) {
        muteLog.error(e)
      }

      // ----- STRIKE SCHEDULE ----- //
      try {
        const strikes = await Strike.findAll()

        if (strikes.length === 0) {
          strikeLog.debug('No strikes scheduled')
        }

        for (const strike of strikes) {
          strikeLog.debug(`Strike scheduled to expire at ${strike.expiration.toLocaleString(DateTime.DATETIME_FULL)}`)
        }

        const expiredStrikes = strikes.filter(strike => strike.expiration <= now)

        for (const strike of expiredStrikes) {
          await Strike.destroy({
            where: { id: strike.id }
          })

          await Case.update({
            active: false
          }, {
            where: { id: strike.id }
          })

          const strikeUser = await guild.member(strike.userID)

          if (strikeUser) {
            const activeStrikes = await Case.count({
              where: {
                userID: strike.userID,
                active: true
              }
            })

            const receipt = this.client.util.embed()
              .setColor(config.embeds.colors.orange)
              .setAuthor(guild.name, guild.iconURL())
              .setTitle(`${config.prefixes.expired} Strike expired`)
              .setDescription(activeStrikes === 0 ? 'No active strikes' : `${activeStrikes} strikes remaining`)
              .setTimestamp()

            strikeUser.send({ embed: receipt })
          }
        }
      } catch (e) {
        strikeLog.error(e)
      }

      // ----- AUTOMOD ----- //
    }, null, null, null, null, true)

    job.start()
  }
}

export default ReadyListener
