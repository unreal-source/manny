import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import ms from 'ms'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class Timeout extends SlashCommand {
  constructor () {
    super({
      name: 'timeout',
      description: 'Timeout a user',
      options: [
        {
          type: 'USER',
          name: 'user',
          description: 'The user you want to time out',
          required: true
        },
        {
          type: 'STRING',
          name: 'duration',
          description: 'How long they should be timed out for',
          required: true,
          choices: [
            { name: '60 secs', value: '60 secs' },
            { name: '5 mins', value: '5 mins' },
            { name: '10 mins', value: '10 mins' },
            { name: '1 hour', value: '1 hour' },
            { name: '1 day', value: '1 day' },
            { name: '1 week', value: '1 week' }
          ]
        },
        {
          type: 'STRING',
          name: 'reason',
          description: 'The reason for timing them out, if any'
        }
      ]
    })
  }

  async run (interaction) {
    const member = interaction.options.getMember('user')
    const duration = interaction.options.getString('duration')
    const reason = interaction.options.getString('reason')
    const prisma = new PrismaClient()

    // You can't timeout the bot or yourself
    if (member.id === this.client.user.id) {
      return interaction.reply({ content: 'Nice try, human.', ephemeral: true })
    }

    if (member.id === interaction.member.id) {
      return interaction.reply({ content: 'You can\'t time yourself out.', ephemeral: true })
    }

    // Timeout the member
    await member.timeout(ms(duration), reason)

    // Send the moderator a confirmation
    await interaction.reply({ content: `${member.user.tag} was timed out for ${duration}.`, ephemeral: true })

    // Create a case in the database
    const incident = await prisma.case.create({
      data: {
        action: 'Timed out',
        member: member.user.tag,
        memberId: member.id,
        moderator: interaction.member.user.tag,
        moderatorId: interaction.member.id,
        reason: reason,
        timeout: {
          create: { duration: duration }
        }
      }
    })

    // Add an entry to the moderation log
    const logChannel = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL)
    const logEntry = new MessageEmbed()
      .setAuthor({ name: `⏳ ${incident.action}` })
      .setTitle(incident.member)
      .addField('Moderator', incident.moderator)
      .addField('Reason', incident.reason)
      .setThumbnail(member.displayAvatarURL())
      .setFooter({ text: `#${incident.id}` })
      .setTimestamp()

    logChannel.send({ embeds: [logEntry] })

    // Notify the member
    const receipt = new MessageEmbed()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .setTitle(`You were timed out for ${duration}`)
      .addField('Reason', reason)
      .setFooter({ text: `Case #${incident.id}` })
      .setTimestamp()

    try {
      await member.send({ embeds: [receipt] })
    } catch (e) {
      await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
    }

    // TODO: Log the incident with Grafana
  }
}

export default Timeout
