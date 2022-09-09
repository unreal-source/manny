import { SlashCommand } from 'hiei.js'
import { ActionRowBuilder, ApplicationCommandOptionType, EmbedBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js'
import { channelMention } from '@discordjs/builders'
import { createModalCollector } from '../../utilities/discord-util.js'
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
          description: 'Post your studio portfolio on job on the job board'
        }
      ],
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    const subcommand = interaction.options.getSubcommand()

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    switch (subcommand) {
      case 'freelancer': {
        const prisma = new PrismaClient()
        const check = await prisma.portfolio.findFirst({
          where: { authorId: interaction.member.id }
        })

        if (check) {
          return interaction.reply({ content: `You already posted your portfolio in ${channelMention(check.channel)}. Please remove it before posting a new one.`, ephemeral: true })
        }

        const questions = new ModalBuilder()
          .setCustomId('freelancerPortfolioModal')
          .setTitle('Post a Freelancer Portfolio')

        const nameInput = new TextInputBuilder()
          .setCustomId('name')
          .setLabel('Your name or company name')
          .setPlaceholder('Stylish Joe')
          .setStyle(TextInputStyle.Short)

        const servicesInput = new TextInputBuilder()
          .setCustomId('services')
          .setLabel('Your Services')
          .setStyle(TextInputStyle.Paragraph)

        const websiteInput = new TextInputBuilder()
          .setCustomId('website')
          .setLabel('Website URL')
          .setStyle(TextInputStyle.Short)

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact Info')
          .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents([nameInput])
        const secondRow = new ActionRowBuilder().addComponents([servicesInput])
        const thirdRow = new ActionRowBuilder().addComponents([websiteInput])
        const fourthRow = new ActionRowBuilder().addComponents([contactInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow])

        await interaction.showModal(questions)

        const collector = createModalCollector(this.client, interaction)

        collector.on('collect', async i => {
          if (i.customId === 'freelancerPortfolioModal') {
            const submitter = i.user
            const name = i.fields.getTextInputValue('name')
            const services = i.fields.getTextInputValue('services')
            const website = i.fields.getTextInputValue('website')
            const contact = i.fields.getTextInputValue('contact')
            const channel = i.guild.channels.cache.get(process.env.FREELANCER_PORTFOLIO_CHANNEL)
            const portfolioPost = new EmbedBuilder()
              .setTitle(name)
              .setDescription(website)
              .addFields([
                { name: 'Services', value: services },
                { name: 'Contact', value: contact }
              ])

            const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [portfolioPost] })
            const edited = portfolioPost.setFooter({ text: `Portfolio ID: ${post.id}` })
            await post.edit({ embeds: [edited] })

            const prisma = new PrismaClient()
            await prisma.portfolio.create({
              data: {
                channel: process.env.FREELANCER_PORTFOLIO_CHANNEL,
                author: submitter.tag,
                authorId: submitter.id,
                messageId: post.id
              }
            })

            await prisma.$disconnect()

            log.info({ event: 'portfolio-posted', channel: interaction.channel.name })

            return i.reply({ content: `Your portfolio was successfully submitted to ${channelMention(process.env.FREELANCER_PORTFOLIO_CHANNEL)}`, ephemeral: true })
          }
        })

        break
      }

      case 'studio': {
        const prisma = new PrismaClient()
        const check = await prisma.portfolio.findFirst({
          where: { authorId: interaction.member.id }
        })

        if (check) {
          return interaction.reply({ content: `You already posted your portfolio in ${channelMention(check.channel)}. Please remove it before posting a new one.`, ephemeral: true })
        }

        const questions = new ModalBuilder()
          .setCustomId('studioPortfolioModal')
          .setTitle('Post a Studio Portfolio')

        const nameInput = new TextInputBuilder()
          .setCustomId('name')
          .setLabel('Your company name')
          .setPlaceholder('Stylish Joe')
          .setStyle(TextInputStyle.Short)

        const servicesInput = new TextInputBuilder()
          .setCustomId('services')
          .setLabel('Your Services')
          .setStyle(TextInputStyle.Paragraph)

        const websiteInput = new TextInputBuilder()
          .setCustomId('website')
          .setLabel('Website URL')
          .setStyle(TextInputStyle.Short)

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact Info')
          .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents([nameInput])
        const secondRow = new ActionRowBuilder().addComponents([servicesInput])
        const thirdRow = new ActionRowBuilder().addComponents([websiteInput])
        const fourthRow = new ActionRowBuilder().addComponents([contactInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow])

        await interaction.showModal(questions)

        const collector = createModalCollector(this.client, interaction)

        collector.on('collect', async i => {
          if (i.customId === 'studioPortfolioModal') {
            const submitter = i.user
            const name = i.fields.getTextInputValue('name')
            const services = i.fields.getTextInputValue('services')
            const website = i.fields.getTextInputValue('website')
            const contact = i.fields.getTextInputValue('contact')
            const channel = i.guild.channels.cache.get(process.env.STUDIO_PORTFOLIO_CHANNEL)
            const portfolioPost = new EmbedBuilder()
              .setTitle(name)
              .setDescription(website)
              .addFields([
                { name: 'Services', value: services },
                { name: 'Contact', value: contact }
              ])

            const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [portfolioPost] })
            const edited = portfolioPost.setFooter({ text: `Portfolio ID: ${post.id}` })
            await post.edit({ embeds: [edited] })

            const prisma = new PrismaClient()
            await prisma.portfolio.create({
              data: {
                channel: process.env.STUDIO_PORTFOLIO_CHANNEL,
                author: submitter.tag,
                authorId: submitter.id,
                messageId: post.id
              }
            })

            await prisma.$disconnect()

            log.info({ event: 'portfolio-posted', channel: interaction.channel.name })

            return i.reply({ content: `Your portfolio was successfully submitted to ${channelMention(process.env.STUDIO_PORTFOLIO_CHANNEL)}`, ephemeral: true })
          }
        })

        break
      }
    }
  }
}

export default AddPortfolio
