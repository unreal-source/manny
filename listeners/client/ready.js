import { Listener } from 'discord-akairo'
import config from '../../config'
import { CronJob } from 'cron'
import { DateTime } from 'luxon'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'

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

        if (mutes.length === 0) {
          this.client.log.debug('No mutes scheduled')
        }

        for (const mute of mutes) {
          this.client.log.debug(`Mute scheduled to expire at ${mute.expiration.toLocaleString(DateTime.DATETIME_FULL)}`)
        }

        const expiredMutes = mutes.filter(mute => mute.expiration <= now)

        for (const mute of expiredMutes) {
          await Mute.destroy({
            where: { id: mute.id }
          })

          const member = await guild.member(mute.id)

          if (member) {
            const muteRole = await guild.roles.fetch(config.roles.muted)
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
        this.client.log.error(e)
      }

      // ----- STRIKE SCHEDULE ----- //
      try {
        const strikes = await Strike.findAll()

        if (strikes.length === 0) {
          this.client.log.debug('No strikes scheduled')
        }

        for (const strike of strikes) {
          this.client.log.debug(`Strike scheduled to expire at ${strike.expiration.toLocaleString(DateTime.DATETIME_FULL)}`)
        }

        const expiredStrikes = strikes.filter(strike => strike.expiration <= now)

        for (const strike of expiredStrikes) {
          await Strike.destroy({
            where: { id: strike.id }
          })

          const record = await Case.update({ active: false }, {
            where: { id: strike.id }
          })

          const member = await guild.member(record.userID)

          if (member) {
            const activeStrikes = await Case.count({
              where: {
                userID: member.id,
                active: true
              }
            })

            const receipt = this.client.util.embed()
              .setColor(config.embeds.colors.orange)
              .setAuthor(guild.name, guild.iconURL())
              .setTitle(`${config.prefixes.expired} Strike expired`)
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
