import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class Undo extends SlashCommand {
  constructor () {
    super({
      name: 'undo',
      description: 'Undo a moderator action',
      options: [
        {
          type: 'SUB_COMMAND',
          name: 'timeout',
          description: 'Cancel a timeout',
          options: [
            {
              type: 'USER',
              name: 'user',
              description: 'The timed out user',
              required: true
            },
            {
              type: 'STRING',
              name: 'reason',
              description: 'The reason for undoing this timeout',
              required: true
            }
          ]
        },
        {
          type: 'SUB_COMMAND',
          name: 'strike',
          description: 'Remove a strike',
          options: [
            {
              type: 'INTEGER',
              name: 'case',
              description: 'The case number for the strike',
              required: true
            },
            {
              type: 'STRING',
              name: 'reason',
              description: 'The reason for undoing this strike',
              required: true
            }
          ]
        },
        {
          type: 'SUB_COMMAND',
          name: 'ban',
          description: 'Revoke a ban',
          options: [
            {
              type: 'USER',
              name: 'user',
              description: 'The banned user',
              required: true
            },
            {
              type: 'STRING',
              name: 'reason',
              description: 'The reason for undoing this ban',
              required: true
            }
          ]
        }
      ]
    })
  }

  async run (interaction) {
    const subcommand = interaction.options.getSubcommand()
    const prisma = new PrismaClient()

    switch (subcommand) {
      case 'timeout': {
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason')

        // Abort if member is gone but still cached
        if (!member) {
          return interaction.reply({ content: 'Member not found. They may have already left the server. If they still appear in autocomplete, refresh your client to clear the cache.', ephemeral: true })
        }

        // You can't timeout the bot or yourself
        if (member.id === this.client.user.id) {
          return interaction.reply({ content: 'Nice try, human.', ephemeral: true })
        }

        if (member.id === interaction.member.id) {
          return interaction.reply({ content: 'You can\'t cancel your own timeout.', ephemeral: true })
        }

        if (member.isCommunicationDisabled()) {
          // Cancel timeout
          await member.timeout(null, reason)

          // Notify moderator
          await interaction.reply({ content: `${member.user.tag} is no longer timed out.`, ephemeral: true })

          // Create case
          const incident = await prisma.case.create({
            data: {
              action: 'Timeout cancelled',
              member: member.user.tag,
              memberId: member.id,
              moderator: interaction.member.user.tag,
              moderatorId: interaction.member.id,
              reason: reason
            }
          })

          // Create mod log
          const modLog = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL)
          const modLogEntry = new MessageEmbed()
            .setAuthor({ name: `↩️ ${incident.action}` })
            .setTitle(incident.member)
            .addField('Moderator', incident.moderator)
            .addField('Reason', incident.reason)
            .setThumbnail(member.displayAvatarURL())
            .setFooter({ text: `#${incident.id}` })
            .setTimestamp()

          modLog.send({ embeds: [modLogEntry] })

          // Notify member
          const receipt = new MessageEmbed()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTitle('Your timeout was cancelled')
            .addField('Reason', reason)
            .setFooter({ text: `Case #${incident.id}` })
            .setTimestamp()

          try {
            await member.send({ embeds: [receipt] })
          } catch (e) {
            await interaction.followUp({ content: ':warning: The user wasn\'t notified because they\'re not accepting direct messages.', ephemeral: true })
          }

          // TODO: Log the incident with Grafana
        } else {
          return interaction.reply({ content: `${member.user.tag} isn not timed out.`, ephemeral: true })
        }

        break
      }

      case 'strike': {
        const caseNumber = interaction.options.getInteger('case')
        const reason = interaction.options.getString('reason')

        // Cache, bot, self guards
        // Check if case is an active strike or member has any strikes
        // If yes: set strike to inactive, notify moderator, create case, create mod log, notify member
        // If no: notify moderator "that case is not an active strike" or "that member has no strikes"
        break
      }

      case 'ban': {
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason')

        // Cache, bot, self guards
        // Check if member is banned
        // If yes: unban member, notify moderator, create case, create mod log, notify member
        // If no: notify moderator "that member is not banned"
        break
      }
    }
  }
}

export default Undo
