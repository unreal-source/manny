import { SlashCommand } from 'hiei.js'
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js'
import log from '../../utilities/logger.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class RemovePost extends SlashCommand {
  constructor () {
    super({
      name: 'remove',
      description: 'Remove your job post or portfolio from the job board',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'job',
          description: 'Remove your job post from the job board',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'Enter the job ID found at the bottom of your post',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'portfolio',
          description: 'Remove your portfolio from the job board',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'Enter the portfolio ID found at the bottom of your post',
              required: true
            }
          ]
        }
      ],
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    const subcommand = interaction.options.getSubcommand()
    const prisma = new PrismaClient()

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    switch (subcommand) {
      case 'job': {
        const id = interaction.options.getString('id')
        const post = await prisma.job.findFirst({
          where: { messageId: id }
        })

        if (!post) {
          await prisma.$disconnect()
          return interaction.reply({ content: 'Job post not found.', ephemeral: true })
        }

        const channel = await interaction.guild.channels.fetch(post.channel)
        const message = await channel.messages.fetch(post.messageId)

        if (message.content.includes(interaction.member.id) && post.authorId === interaction.member.id) {
          await message.delete()
          await prisma.job.delete({
            where: { messageId: id }
          })

          await prisma.$disconnect()

          log.info({ event: 'job-removed', channel: interaction.channel.name })

          return interaction.reply({ content: 'Job post successfully removed.', ephemeral: true })
        }

        interaction.reply({ content: 'You must be the author of a job post to remove it.', ephemeral: true })
        break
      }

      case 'portfolio': {
        const id = interaction.options.getString('id')
        const post = await prisma.portfolio.findFirst({
          where: { messageId: id }
        })

        if (!post) {
          await prisma.$disconnect()
          return interaction.reply({ content: 'Portfolio not found.', ephemeral: true })
        }

        const channel = await interaction.guild.channels.fetch(post.channel)
        const message = await channel.messages.fetch(post.messageId)

        if (message.content.includes(interaction.member.id) && post.authorId === interaction.member.id) {
          await message.delete()
          await prisma.portfolio.delete({
            where: { messageId: id }
          })

          await prisma.$disconnect()

          log.info({ event: 'portfolio-removed', channel: interaction.channel.name })

          return interaction.reply({ content: 'Portfolio successfully removed.', ephemeral: true })
        }

        interaction.reply({ content: 'You must be the author of a portfolio to remove it.', ephemeral: true })
        break
      }
    }
  }
}

export default RemovePost