import { Listener } from 'discord-akairo'
import config from '../../config'
import { CronJob } from 'cron'
import { DateTime } from 'luxon'
import Mute from '../../models/mutes'

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
      const now = DateTime.local()
      const mutes = await Mute.findAll()

      if (mutes.length === 0) {
        return this.client.log.info('No mutes scheduled')
      }

      for (const mute of mutes) {
        this.client.log.info(`Mute scheduled to expire at ${mute.expiration.toLocaleString(DateTime.DATETIME_FULL)}`)
      }

      const expired = mutes.filter(mute => mute.expiration <= now)
      this.client.log.debug(`${expired.length} have expired`)

      for (const mute of expired) {
        const guild = this.client.guilds.cache.first()
        const member = await guild.member(mute.id)

        // Unmute user
        await member.roles.remove(config.infractions.mutedRole)

        // Remove mute from schedule
        await Mute.destroy({
          where: { id: mute.id }
        })

        // Send receipt
        const receipt = this.client.util.embed()
          .setColor(config.embeds.colors.yellow)
          .setAuthor(guild.name, guild.iconURL())
          .setTitle(`${config.prefixes.expired} Your mute expired`)
          .setDescription('You may now send messages in the server again.')
          .setTimestamp()

        member.send({ embed: receipt })
      }
    }, null, null, null, null, true)

    job.start()
  }
}

export default ReadyListener
