import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class Ban extends SlashCommand {
  constructor () {
    super({
      name: 'ban',
      description: 'Ban a user',
      options: [
        {
          type: 'USER',
          name: 'user',
          description: 'The user you want to ban',
          required: true
        },
        {
          type: 'INTEGER',
          name: 'messages',
          description: 'How much of their recent message history to delete',
          required: true,
          choices: [
            { name: 'Don\'t delete any', value: 0 },
            { name: 'Previous 24 hours', value: 1 },
            { name: 'Previous 7 days', value: 7 }
          ]
        },
        {
          type: 'STRING',
          name: 'reason',
          description: 'The reason for banning them, if any'
        }
      ]
    })
  }

  async run (interaction) {
    const member = interaction.options.getMember('user')
    const messages = interaction.options.getInteger('messages')
    const reason = interaction.options.getString('reason')
    const prisma = new PrismaClient()

    // Abort if member is gone but still cached
    if (!member) {
      return interaction.reply({ content: 'Member not found. They may have already left the server. If they still appear in autocomplete, refresh your client to clear the cache.', ephemeral: true })
    }

    // You can't ban the bot or yourself
    if (member.id === this.client.user.id) {
      return interaction.reply({ content: 'Nice try, human.', ephemeral: true })
    }

    if (member.id === interaction.member.id) {
      return interaction.reply({ content: 'You can\'t ban yourself.', ephemeral: true })
    }

    // Make sure member is bannable
    if (member.bannable) {
      // Create case
      const incident = await prisma.case.create({
        data: {
          action: 'Banned',
          member: member.user.tag,
          memberId: member.id,
          moderator: interaction.member.user.tag,
          moderatorId: interaction.member.id,
          reason: reason
        }
      })

      // Notify member
      const notification = new MessageEmbed()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTitle('You were banned from the server')
        .addField('Reason', reason)
        .addField('How to Appeal', `If you don't agree with this decision, you can appeal it by [filling out this form](${process.env.BAN_APPEAL_LINK}). Our staff will review your appeal and respond as soon as possible.`)
        .setFooter({ text: `Case #${incident.id}` })
        .setTimestamp()

      try {
        await member.send({ embeds: [notification] })
      } catch (e) {
        await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
      }

      // Ban member
      await member.ban({ days: messages, reason: reason })

      // Notify moderator
      await interaction.reply({ content: `${member.user.tag} was banned from the server.`, ephemeral: true })

      // Create mod log
      const modLog = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL)
      const modLogEntry = new MessageEmbed()
        .setAuthor({ name: `🚫 ${incident.action}` })
        .setTitle(incident.member)
        .addField('Moderator', incident.moderator)
        .addField('Reason', incident.reason)
        .setThumbnail(member.displayAvatarURL())
        .setFooter({ text: `Case #${incident.id}` })
        .setTimestamp()

      modLog.send({ embeds: [modLogEntry] })

      // TODO: Log the incident with Grafana
    } else {
      return interaction.reply({ content: 'I don\'t have permission to ban that member.', ephemeral: true })
    }
  }
}

export default Ban
