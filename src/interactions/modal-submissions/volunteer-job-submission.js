import { ModalSubmission } from 'hiei.js'
import { EmbedBuilder } from 'discord.js'
import { channelMention } from '@discordjs/builders'
import log from '../../utilities/logger.js'
import prisma from '../../utilities/prisma-client.js'

class VolunteerJobSubmission extends ModalSubmission {
  constructor () {
    super({
      id: 'volunteerJobModal'
    })
  }

  async run (interaction) {
    const submitter = interaction.user
    const title = interaction.fields.getTextInputValue('title')
    const details = interaction.fields.getTextInputValue('details')
    const contact = interaction.fields.getTextInputValue('contact')
    const channel = interaction.guild.channels.cache.get(process.env.VOLUNTEER_JOB_CHANNEL)
    const jobPost = new EmbedBuilder()
      .setTitle(title)
      .setDescription(details)
      .addFields([{ name: 'Contact', value: contact }])

    const post = await channel.send({ content: `Posted by <@${submitter.id}>`, embeds: [jobPost] })
    const edited = jobPost.setFooter({ text: `Job ID: ${post.id}` })
    await post.edit({ embeds: [edited] })

    await prisma.job.create({
      data: {
        channel: process.env.VOLUNTEER_JOB_CHANNEL,
        author: submitter.tag,
        authorId: submitter.id,
        messageId: post.id
      }
    })

    log.info({ event: 'job-posted', channel: interaction.channel.name })

    return interaction.reply({ content: `Your post was successfully submitted to ${channelMention(process.env.VOLUNTEER_JOB_CHANNEL)}`, ephemeral: true })
  }
}

export default VolunteerJobSubmission
