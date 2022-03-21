import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class Kick extends SlashCommand {
  constructor () {
    super({
      name: 'kick',
      description: 'Kick a user',
      options: [
        {
          type: 'USER',
          name: 'user',
          description: 'The user you want to kick',
          required: true
        },
        {
          type: 'STRING',
          name: 'reason',
          description: 'The reason for kicking them, if any'
        }
      ]
    })
  }

  async run (interaction) {
    const member = interaction.options.getMember('user')
    const reason = interaction.options.getString('reason')
    const prisma = new PrismaClient()

    // Abort if member is gone but still cached
    if (!member) {
      return interaction.reply({ content: 'Member not found. They may have already left the server. If they still appear in autocomplete, refresh your client to clear the cache.', ephemeral: true })
    }

    // You can't kick the bot or yourself
    if (member.id === this.client.user.id) {
      return interaction.reply({ content: 'Nice try, human.', ephemeral: true })
    }

    if (member.id === interaction.member.id) {
      return interaction.reply({ content: 'You can\'t kick yourself.', ephemeral: true })
    }

    // Make sure member is kickable
    if (member.kickable) {
      // Create case in database
      const incident = await prisma.case.create({
        data: {
          action: 'Kicked',
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
        .setTitle('You were kicked from the server')
        .addField('Reason', reason)
        .setFooter({ text: `Case #${incident.id}` })
        .setTimestamp()

      try {
        await member.send({ embeds: [notification] })
      } catch (e) {
        await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
      }

      // Kick member
      await member.kick(reason)

      // Notify moderator
      await interaction.reply({ content: `${member.user.tag} was kicked from the server.`, ephemeral: true })

      // Send mod log
      const logChannel = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL)
      const logEntry = new MessageEmbed()
        .setAuthor({ name: `🥾 ${incident.action}` })
        .setTitle(incident.member)
        .addField('Moderator', incident.moderator)
        .addField('Reason', incident.reason)
        .setThumbnail(member.displayAvatarURL())
        .setFooter({ text: `Case #${incident.id}` })
        .setTimestamp()

      logChannel.send({ embeds: [logEntry] })

      // TODO: Log the incident with Grafana
    } else {
      return interaction.reply({ content: 'I don\'t have permission to kick that member.', ephemeral: true })
    }
  }
}

export default Kick
