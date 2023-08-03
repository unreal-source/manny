import { SlashCommand } from 'hiei.js'
import { ActionRowBuilder, ApplicationCommandOptionType, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js'
import { channelMention } from '@discordjs/builders'
import log from '../../utilities/logger.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class AddPortfolio extends SlashCommand {
  constructor () {
    super({
      name: 'portfolio',
      description: 'Post your portfolio on the job board',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'freelancer',
          description: 'Post your freelancer portfolio on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'studio',
          description: 'Post your studio portfolio on the job board'
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
      case 'freelancer': {
        const check = await prisma.portfolio.findFirst({
          where: { authorId: interaction.member.id }
        })

        if (check) {
          await prisma.$disconnect()
          return interaction.reply({ content: `You already posted your portfolio in ${channelMention(check.channel)}. Please remove it before posting a new one.`, ephemeral: true })
        }

        const questions = new ModalBuilder()
          .setCustomId('freelancerPortfolioModal')
          .setTitle('Post a Freelancer Portfolio')

        const nameInput = new TextInputBuilder()
          .setCustomId('name')
          .setLabel('Your name or company name')
          .setPlaceholder('Joe McUnreal')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(256)

        const servicesInput = new TextInputBuilder()
          .setCustomId('services')
          .setLabel('Your Services')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const websiteInput = new TextInputBuilder()
          .setCustomId('website')
          .setLabel('Website URL')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact Info')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const firstRow = new ActionRowBuilder().addComponents([nameInput])
        const secondRow = new ActionRowBuilder().addComponents([servicesInput])
        const thirdRow = new ActionRowBuilder().addComponents([websiteInput])
        const fourthRow = new ActionRowBuilder().addComponents([contactInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow])

        await interaction.showModal(questions)

        break
      }

      case 'studio': {
        const check = await prisma.portfolio.findFirst({
          where: { authorId: interaction.member.id }
        })

        if (check) {
          await prisma.$disconnect()
          return interaction.reply({ content: `You already posted your portfolio in ${channelMention(check.channel)}. Please remove it before posting a new one.`, ephemeral: true })
        }

        const questions = new ModalBuilder()
          .setCustomId('studioPortfolioModal')
          .setTitle('Post a Studio Portfolio')

        const nameInput = new TextInputBuilder()
          .setCustomId('name')
          .setLabel('Your company name')
          .setPlaceholder('Lumen Lover Studios')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(256)

        const servicesInput = new TextInputBuilder()
          .setCustomId('services')
          .setLabel('Your Services')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const websiteInput = new TextInputBuilder()
          .setCustomId('website')
          .setLabel('Website URL')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact Info')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const firstRow = new ActionRowBuilder().addComponents([nameInput])
        const secondRow = new ActionRowBuilder().addComponents([servicesInput])
        const thirdRow = new ActionRowBuilder().addComponents([websiteInput])
        const fourthRow = new ActionRowBuilder().addComponents([contactInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow])

        await interaction.showModal(questions)

        break
      }
    }
  }
}

export default AddPortfolio
