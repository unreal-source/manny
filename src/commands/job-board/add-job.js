import { SlashCommand } from 'hiei.js'
import { ActionRowBuilder, ApplicationCommandOptionType, EmbedBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js'
import { channelMention } from '@discordjs/builders'
import { createModalCollector } from '../../utilities/discord-util.js'
import log from '../../utilities/logger.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class AddJob extends SlashCommand {
  constructor () {
    super({
      name: 'job',
      description: 'Post a job opportunity on the job board',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'salary',
          description: 'Post a salary job on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'freelance',
          description: 'Post a freelance job on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'revshare',
          description: 'Post a revenue share job on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'volunteer',
          description: 'Post volunteer project on the job board'
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
      case 'salary': {
        const questions = new ModalBuilder()
          .setCustomId('salaryJobModal')
          .setTitle('Post a Salary Job')

        const roleInput = new TextInputBuilder()
          .setCustomId('role')
          .setLabel('Role & company')
          .setPlaceholder('Technical Artist at Acme Games')
          .setStyle(TextInputStyle.Short)

        const locationInput = new TextInputBuilder()
          .setCustomId('location')
          .setLabel('Location')
          .setStyle(TextInputStyle.Short)

        const responsibilitiesInput = new TextInputBuilder()
          .setCustomId('responsibilities')
          .setLabel('Responsibilities')
          .setStyle(TextInputStyle.Paragraph)

        const qualificationsInput = new TextInputBuilder()
          .setCustomId('qualifications')
          .setLabel('Qualifications')
          .setStyle(TextInputStyle.Paragraph)

        const applyInput = new TextInputBuilder()
          .setCustomId('apply')
          .setLabel('How to apply')
          .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents([roleInput])
        const secondRow = new ActionRowBuilder().addComponents([locationInput])
        const thirdRow = new ActionRowBuilder().addComponents([responsibilitiesInput])
        const fourthRow = new ActionRowBuilder().addComponents([qualificationsInput])
        const fifthRow = new ActionRowBuilder().addComponents([applyInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow, fifthRow])

        await interaction.showModal(questions)

        const collector = createModalCollector(this.client, interaction)

        collector.on('collect', async i => {
          if (i.customId === 'salaryJobModal') {
            const submitter = i.user
            const role = i.fields.getTextInputValue('role')
            const location = i.fields.getTextInputValue('location')
            const responsibilities = i.fields.getTextInputValue('responsibilities')
            const qualificiations = i.fields.getTextInputValue('qualifications')
            const apply = i.fields.getTextInputValue('apply')
            const channel = i.guild.channels.cache.get(process.env.SALARY_JOB_CHANNEL)
            const jobPost = new EmbedBuilder()
              .setTitle(role)
              .addFields([
                { name: 'Location', value: location },
                { name: 'Responsibilities', value: responsibilities },
                { name: 'Qualifications', value: qualificiations },
                { name: 'How to Apply', value: apply }
              ])

            const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [jobPost] })
            const edited = jobPost.setFooter({ text: `Job ID: ${post.id}` })
            await post.edit({ embeds: [edited] })

            await prisma.jobPost.create({
              data: {
                channel: process.env.SALARY_JOB_CHANNEL,
                author: submitter.tag,
                authorId: submitter.id,
                messageId: post.id
              }
            })

            await prisma.$disconnect()

            log.info({ event: 'job-posted', channel: interaction.channel.name })

            return i.reply({ content: `Your post was successfully submitted to ${channelMention(process.env.SALARY_JOB_CHANNEL)}`, ephemeral: true })
          }
        })

        break
      }

      case 'freelance': {
        const questions = new ModalBuilder()
          .setCustomId('freelanceJobModal')
          .setTitle('Post a Freelance Job')

        const roleInput = new TextInputBuilder()
          .setCustomId('role')
          .setLabel('Role & company')
          .setPlaceholder('Technical Artist at Acme Games')
          .setStyle(TextInputStyle.Short)

        const locationInput = new TextInputBuilder()
          .setCustomId('location')
          .setLabel('Location')
          .setStyle(TextInputStyle.Short)

        const responsibilitiesInput = new TextInputBuilder()
          .setCustomId('responsibilities')
          .setLabel('Responsibilities')
          .setStyle(TextInputStyle.Paragraph)

        const qualificationsInput = new TextInputBuilder()
          .setCustomId('qualifications')
          .setLabel('Qualifications')
          .setStyle(TextInputStyle.Paragraph)

        const applyInput = new TextInputBuilder()
          .setCustomId('apply')
          .setLabel('How to apply')
          .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents([roleInput])
        const secondRow = new ActionRowBuilder().addComponents([locationInput])
        const thirdRow = new ActionRowBuilder().addComponents([responsibilitiesInput])
        const fourthRow = new ActionRowBuilder().addComponents([qualificationsInput])
        const fifthRow = new ActionRowBuilder().addComponents([applyInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow, fifthRow])

        await interaction.showModal(questions)

        const collector = createModalCollector(this.client, interaction)

        collector.on('collect', async i => {
          if (i.customId === 'freelanceJobModal') {
            const submitter = i.user
            const role = i.fields.getTextInputValue('role')
            const location = i.fields.getTextInputValue('location')
            const responsibilities = i.fields.getTextInputValue('responsibilities')
            const qualificiations = i.fields.getTextInputValue('qualifications')
            const apply = i.fields.getTextInputValue('apply')
            const channel = i.guild.channels.cache.get(process.env.FREELANCE_JOB_CHANNEL)
            const jobPost = new EmbedBuilder()
              .setTitle(role)
              .addFields([
                { name: 'Location', value: location },
                { name: 'Responsibilities', value: responsibilities },
                { name: 'Qualifications', value: qualificiations },
                { name: 'How to Apply', value: apply }
              ])

            const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [jobPost] })
            const edited = jobPost.setFooter({ text: `Job ID: ${post.id}` })
            await post.edit({ embeds: [edited] })

            await prisma.jobPost.create({
              data: {
                channel: process.env.FREELANCE_JOB_CHANNEL,
                author: submitter.tag,
                authorId: submitter.id,
                messageId: post.id
              }
            })

            await prisma.$disconnect()

            log.info({ event: 'job-posted', channel: interaction.channel.name })

            return i.reply({ content: `Your post was successfully submitted to ${channelMention(process.env.FREELANCE_JOB_CHANNEL)}`, ephemeral: true })
          }
        })

        break
      }

      case 'revshare': {
        const questions = new ModalBuilder()
          .setCustomId('revshareJobModal')
          .setTitle('Post a Revenue Share Job')

        const roleInput = new TextInputBuilder()
          .setCustomId('role')
          .setLabel('Role & company')
          .setPlaceholder('Technical Artist at Acme Games')
          .setStyle(TextInputStyle.Short)

        const locationInput = new TextInputBuilder()
          .setCustomId('location')
          .setLabel('Location')
          .setStyle(TextInputStyle.Short)

        const responsibilitiesInput = new TextInputBuilder()
          .setCustomId('responsibilities')
          .setLabel('Responsibilities')
          .setStyle(TextInputStyle.Paragraph)

        const qualificationsInput = new TextInputBuilder()
          .setCustomId('qualifications')
          .setLabel('Qualifications')
          .setStyle(TextInputStyle.Paragraph)

        const applyInput = new TextInputBuilder()
          .setCustomId('apply')
          .setLabel('How to apply')
          .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents([roleInput])
        const secondRow = new ActionRowBuilder().addComponents([locationInput])
        const thirdRow = new ActionRowBuilder().addComponents([responsibilitiesInput])
        const fourthRow = new ActionRowBuilder().addComponents([qualificationsInput])
        const fifthRow = new ActionRowBuilder().addComponents([applyInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow, fifthRow])

        await interaction.showModal(questions)

        const collector = createModalCollector(this.client, interaction)

        collector.on('collect', async i => {
          if (i.customId === 'revshareJobModal') {
            const submitter = i.user
            const role = i.fields.getTextInputValue('role')
            const location = i.fields.getTextInputValue('location')
            const responsibilities = i.fields.getTextInputValue('responsibilities')
            const qualificiations = i.fields.getTextInputValue('qualifications')
            const apply = i.fields.getTextInputValue('apply')
            const channel = i.guild.channels.cache.get(process.env.REVSHARE_JOB_CHANNEL)
            const jobPost = new EmbedBuilder()
              .setTitle(role)
              .addFields([
                { name: 'Location', value: location },
                { name: 'Responsibilities', value: responsibilities },
                { name: 'Qualifications', value: qualificiations },
                { name: 'How to Apply', value: apply }
              ])

            const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [jobPost] })
            const edited = jobPost.setFooter({ text: `Job ID: ${post.id}` })
            await post.edit({ embeds: [edited] })

            await prisma.jobPost.create({
              data: {
                channel: process.env.REVSHARE_JOB_CHANNEL,
                author: submitter.tag,
                authorId: submitter.id,
                messageId: post.id
              }
            })

            await prisma.$disconnect()

            log.info({ event: 'job-posted', channel: interaction.channel.name })

            return i.reply({ content: `Your post was successfully submitted to ${channelMention(process.env.REVSHARE_JOB_CHANNEL)}`, ephemeral: true })
          }
        })

        break
      }

      case 'volunteer': {
        const questions = new ModalBuilder()
          .setCustomId('volunteerJobModal')
          .setTitle('Post a Volunteer Job')

        const titleInput = new TextInputBuilder()
          .setCustomId('title')
          .setLabel('Title')
          .setPlaceholder('Artist needed for mod project')
          .setStyle(TextInputStyle.Short)

        const detailsInput = new TextInputBuilder()
          .setCustomId('details')
          .setLabel('Project Details')
          .setStyle(TextInputStyle.Paragraph)

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact')
          .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents([titleInput])
        const secondRow = new ActionRowBuilder().addComponents([detailsInput])
        const thirdRow = new ActionRowBuilder().addComponents([contactInput])

        questions.addComponents([firstRow, secondRow, thirdRow])

        await interaction.showModal(questions)

        const collector = createModalCollector(this.client, interaction)

        collector.on('collect', async i => {
          if (i.customId === 'volunteerJobModal') {
            const submitter = i.user
            const title = i.fields.getTextInputValue('title')
            const details = i.fields.getTextInputValue('details')
            const contact = i.fields.getTextInputValue('contact')
            const channel = i.guild.channels.cache.get(process.env.VOLUNTEER_JOB_CHANNEL)
            const jobPost = new EmbedBuilder()
              .setTitle(title)
              .setDescription(details)
              .addFields([{ name: 'Contact', value: contact }])

            const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [jobPost] })
            const edited = jobPost.setFooter({ text: `Job ID: ${post.id}` })
            await post.edit({ embeds: [edited] })

            await prisma.jobPost.create({
              data: {
                channel: process.env.VOLUNTEER_JOB_CHANNEL,
                author: submitter.tag,
                authorId: submitter.id,
                messageId: post.id
              }
            })

            await prisma.$disconnect()

            log.info({ event: 'job-posted', channel: interaction.channel.name })

            return i.reply({ content: `Your post was successfully submitted to ${channelMention(process.env.VOLUNTEER_JOB_CHANNEL)}`, ephemeral: true })
          }
        })

        break
      }
    }
  }
}

export default AddJob
