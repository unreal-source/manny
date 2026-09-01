import { EmbedBuilder } from 'discord.js'
import { Listener } from 'hiei.js'
import ms from 'ms'
import { getUsername } from '../utilities/discord-util.js'
import log from '../utilities/logger.js'
import prisma from '../utilities/prisma-client.js'

class MessageCreate extends Listener {
  constructor () {
    super({
      name: 'MessageCreate',
      emitter: 'client',
      event: 'messageCreate'
    })
  }

  async run(message) {
    if (message.author.bot) return

    const attachmentCount = [...message.attachments.values()].filter((a) => a.contentType.includes('image')).length
    const imageUrlRE = /\bhttps?:\/\/\S+\.(?:png|jpe?g|gif|webp|bmp|svg)\b/gi
    const urlCount = (message.content.match(imageUrlRE) ?? []).length
    const totalCount = attachmentCount + urlCount

    if (totalCount < process.env.SUSPECT_MEDIA_THRESHOLD) return

    const now = Date.now()
    const author = message.author.id
    const channel = message.channel.id
    let entries = this.client.suspects.get(author) ?? []

    entries = entries.filter((e) => now - e.timestamp < ms(process.env.SUSPECT_WINDOW))
    entries.push({ channel, timestamp: now })
    this.client.suspects.set(author, entries)

    const distinctChannels = new Set(entries.map((e) => e.channel))
    log.info(`${message.author.username} sent a suspicious message with ${attachmentCount} image attachments, ${urlCount} image URLs in ${distinctChannels.size} ${distinctChannels.size > 1 ? 'channels' : 'channel'}`)

    if (distinctChannels.size >= process.env.SUSPECT_CHANNEL_THRESHOLD) {
      log.info(`Timing out ${message.author.username} for suspected account compromise`)
      try {
        await message.member.timeout(ms('1h'), 'Suspected account compromise')

        const incident = await prisma.case.create({
          data: {
            action: 'Timed out',
            member: getUsername(message.member),
            memberId: message.member.id,
            moderator: this.client.user.username,
            moderatorId: this.client.user.id,
            reason: 'Suspected account compromise',
            timeout: {
              create: { duration: '1 hour' }
            }
          }
        })

        const moderationLogChannel = message.guild.channels.cache.get(process.env.MODERATION_LOG_CHANNEL)
        const moderationLogEmbed = new EmbedBuilder()
          .setAuthor({ name: '⏳ Timed out for 1 hour' })
          .setDescription(`**Member:** ${incident.member}\n**Member ID:** ${incident.memberId}\n**Reason:** ${incident.reason}`)
          .setFooter({ text: `Case ${incident.id} • ${incident.moderator}` })
          .setThumbnail(message.member.displayAvatarURL())
          .setTimestamp()

        const moderationLogEntry = await moderationLogChannel.send({ embeds: [moderationLogEmbed] })

        await prisma.case.update({
          where: { id: incident.id },
          data: { reference: moderationLogEntry.url }
        })

        prisma.$disconnect()
      } catch (e) {
        log.error(e)
      }
    }
  }
}

export default MessageCreate
