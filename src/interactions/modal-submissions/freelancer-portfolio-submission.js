import { ModalSubmission } from 'hiei.js'
import { EmbedBuilder } from 'discord.js'
import { channelMention } from '@discordjs/builders'
import log from '../../utilities/logger.js'
import prisma from '../../utilities/prisma-client.js'

class FreelancerPortfolioSubmission extends ModalSubmission {
  constructor () {
    super({
      id: 'freelancerPortfolioModal'
    })
  }

  async run (interaction) {
    const submitter = interaction.user
    const name = interaction.fields.getTextInputValue('name')
    const services = interaction.fields.getTextInputValue('services')
    const website = interaction.fields.getTextInputValue('website')
    const contact = interaction.fields.getTextInputValue('contact')
    const channel = interaction.guild.channels.cache.get(process.env.FREELANCER_PORTFOLIO_CHANNEL)
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

    await prisma.portfolio.create({
      data: {
        channel: process.env.FREELANCER_PORTFOLIO_CHANNEL,
        author: submitter.tag,
        authorId: submitter.id,
        messageId: post.id
      }
    })

    log.info({ event: 'portfolio-posted', channel: interaction.channel.name })

    return interaction.reply({ content: `Your portfolio was successfully submitted to ${channelMention(process.env.FREELANCER_PORTFOLIO_CHANNEL)}`, ephemeral: true })
  }
}

export default FreelancerPortfolioSubmission
