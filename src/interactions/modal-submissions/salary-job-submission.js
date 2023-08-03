import { ModalSubmission } from 'hiei.js'
import { EmbedBuilder } from 'discord.js'
import { channelMention } from '@discordjs/builders'
import log from '../../utilities/logger.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class SalaryJobSubmission extends ModalSubmission {
  constructor () {
    super({
      id: 'salaryJobModal'
    })
  }

  async run (interaction) {
    const prisma = new PrismaClient()
    const submitter = interaction.user
    const role = interaction.fields.getTextInputValue('role')
    const location = interaction.fields.getTextInputValue('location')
    const responsibilities = interaction.fields.getTextInputValue('responsibilities')
    const qualificiations = interaction.fields.getTextInputValue('qualifications')
    const apply = interaction.fields.getTextInputValue('apply')
    const channel = interaction.guild.channels.cache.get(process.env.SALARY_JOB_CHANNEL)
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

    await prisma.job.create({
      data: {
        channel: process.env.SALARY_JOB_CHANNEL,
        author: submitter.tag,
        authorId: submitter.id,
        messageId: post.id
      }
    })

    await prisma.$disconnect()

    log.info({ event: 'job-posted', channel: interaction.channel.name })

    return interaction.reply({ content: `Your post was successfully submitted to ${channelMention(process.env.SALARY_JOB_CHANNEL)}`, ephemeral: true })
  }
}

export default SalaryJobSubmission
