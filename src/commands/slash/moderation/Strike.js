import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { time } from '@discordjs/builders'
import ms from 'ms'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class Strike extends SlashCommand {
  constructor () {
    super({
      name: 'strike',
      description: 'Give someone a strike',
      options: [
        {
          type: 'USER',
          name: 'user',
          description: 'The user you want to give a strike to',
          required: true
        },
        {
          type: 'STRING',
          name: 'reason',
          description: 'The reason for this strike, if any'
        }
      ]
    })
  }

  async run (interaction) {
    const member = interaction.options.getMember('user')
    const reason = interaction.options.getString('reason')
    const now = new Date()
    const expiration = new Date(now.setDate(now.getDate() + 30))
    const prisma = new PrismaClient()

    // Abort if member is gone but still cached
    if (!member) {
      return interaction.reply({ content: 'Member not found. They may have already left the server. If they still appear in autocomplete, refresh your client to clear the cache.', ephemeral: true })
    }

    // You can't give a strike to the bot or yourself
    if (member.id === this.client.user.id) {
      return interaction.reply({ content: 'Nice try, human.', ephemeral: true })
    }

    if (member.id === interaction.member.id) {
      return interaction.reply({ content: 'You can\'t give yourself a strike.', ephemeral: true })
    }

    // Create case
    const incident = await prisma.case.create({
      data: {
        action: 'Strike added',
        member: member.user.tag,
        memberId: member.id,
        moderator: interaction.member.user.tag,
        moderatorId: interaction.member.id,
        reason: reason,
        strike: {
          create: {
            expiration: expiration,
            isActive: true
          }
        }
      },
      include: { strike: true }
    })

    // Get active strikes
    const activeStrikes = await prisma.case.count({
      where: {
        action: 'Strike added',
        memberId: member.id,
        strike: {
          isActive: true
        }
      }
    })

    const modLog = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL)
    const modLogEntry = new MessageEmbed()
      .setColor('#ffa94d')
      .setTitle(incident.member)
      .addField('Moderator', incident.moderator)
      .addField('Reason', incident.reason)
      .setThumbnail(member.displayAvatarURL())
      .setFooter({ text: `Case #${incident.id}` })
      .setTimestamp()

    const notification = new MessageEmbed()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .addField('Reason', reason)
      .setFooter({ text: `Case #${incident.id}` })
      .setTimestamp()

    // Strike 1
    if (activeStrikes === 1) {
      // Timeout for 10 mins
      await member.timeout(ms(process.env.STRIKE_ONE_TIMEOUT_DURATION), reason)

      // Notify moderator
      await interaction.reply({ content: `${member.user.tag} got strike ${activeStrikes} and was timed out for ${process.env.STRIKE_ONE_TIMEOUT_DURATION}.`, ephemeral: true })

      // Create mod log
      modLogEntry
        .setAuthor({ name: '🚩 Strike 1 • Timed out for 10 mins' })
        .addField('Expiration', time(incident.strike.expiration, 'R'))

      await modLog.send({ embeds: [modLogEntry] })

      // Notify member
      notification
        .setTitle('Strike 1 • You were timed out for 10 mins')
        .addField('Expiration', time(incident.strike.expiration, 'R'))

      try {
        await member.send({ embeds: [notification] })
      } catch (e) {
        await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
      }
    }

    // Strike 2
    if (activeStrikes === 2) {
      // Timeout for 1 hour
      await member.timeout(ms(process.env.STRIKE_TWO_TIMEOUT_DURATION), reason)

      // Notify moderator
      await interaction.reply({ content: `${member.user.tag} got strike ${activeStrikes} and was timed out for ${process.env.STRIKE_TWO_TIMEOUT_DURATION}.`, ephemeral: true })

      // Create mod log
      modLogEntry
        .setAuthor({ name: '🚩 Strike 2 • Timed out for 1 hour' })
        .addField('Expiration', time(incident.strike.expiration, 'R'))

      await modLog.send({ embeds: [modLogEntry] })

      // Notify member
      notification
        .setTitle('Strike 2 • You were timed out for 1 hour')
        .addField('Expiration', time(incident.strike.expiration, 'R'))

      try {
        await member.send({ embeds: [notification] })
      } catch (e) {
        await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
      }
    }

    // Strike 3 - Banned
    if (activeStrikes === 3) {
      if (member.bannable) {
        // Notify member
        notification.setTitle('Strike 3 • You were banned from the server')

        try {
          await member.send({ embeds: [notification] })
        } catch (e) {
          await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
        }

        // Ban member
        await member.ban({ days: 1, reason: reason })

        // Notify moderator
        await interaction.reply({ content: `${member.user.tag} got strike ${activeStrikes} and was banned from the server.`, ephemeral: true })

        // Create mod log
        modLogEntry.setAuthor({ name: '🚩 Strike 3 • Banned from the server' })
        await modLog.send({ embeds: [modLogEntry] })
      } else {
        return interaction.reply({ content: 'I don\'t have permission to ban that member.', ephemeral: true })
      }
    }

    // TODO: Log the incident with Grafana
  }
}

export default Strike
