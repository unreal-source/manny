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

    // You can't kick the bot or yourself
    if (member.id === this.client.user.id) {
      return interaction.reply({ content: 'Nice try, human.', ephemeral: true })
    }

    if (member.id === interaction.member.id) {
      return interaction.reply({ content: 'You can\'t kick yourself.', ephemeral: true })
    }

    // Kick the member
    await member.kick(reason)

    // Send the moderator a confirmation
    await interaction.reply({ content: `${member.user.tag} was kicked from the server.`, ephemeral: true })

    // Create a case in the database
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

    // Add an entry to the moderation log
    const logChannel = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL)
    const logEntry = new MessageEmbed()
      .setAuthor({ name: `🥾 ${incident.action}` })
      .setTitle(incident.member)
      .addField('Moderator', incident.moderator)
      .addField('Reason', incident.reason)
      .setThumbnail(member.displayAvatarURL())
      .setFooter({ text: `#${incident.id}` })
      .setTimestamp()

    logChannel.send({ embeds: [logEntry] })

    // TODO: Log the incident with Grafana
  }
}

export default Kick
