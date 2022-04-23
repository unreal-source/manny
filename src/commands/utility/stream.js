import { SlashCommand } from 'hiei.js'
import { time } from '@discordjs/builders'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

class Stream extends SlashCommand {
  constructor () {
    super({
      name: 'stream',
      description: 'Request permission to stream in a voice channel'
    })
  }

  async run (interaction) {
    const daysSinceJoin = Math.floor((Date.now() - interaction.member.joinedAt) / (86400 * 1000))
    const eligibleDate = new Date(interaction.member.joinedAt.setDate(interaction.member.joinedAt.getDate() + 7))
    const prisma = new PrismaClient()
    const strikes = await prisma.case.findMany({
      where: {
        action: 'Strike added',
        memberId: interaction.member.id,
        strike: {
          isActive: true
        }
      },
      include: { strike: true },
      orderBy: {
        strike: { expiration: 'desc' }
      }
    })

    if (daysSinceJoin < 7) {
      return interaction.reply({ content: `You are not eligible for streaming yet. Please try again ${time(eligibleDate, 'R')}.`, ephemeral: true })
    }

    if (strikes.length === 0) {
      if (interaction.member.roles.cache.some(role => role.id === process.env.STREAMING_ROLE)) {
        return interaction.reply({ content: `You already have permission to stream in ${interaction.member.voice.channel.name}.`, ephemeral: true })
      }

      if (interaction.member.voice.channel) {
        await interaction.member.roles.add(process.env.STREAMING_ROLE)
        return interaction.reply({ content: `You may now stream in ${interaction.member.voice.channel.name}.`, ephemeral: true })
      }

      return interaction.reply({ content: 'Please join the voice channel you want to stream in, then try again.', ephemeral: true })
    }

    return interaction.reply({ content: `You are not eligible to stream because you have one or more strikes. Please try again ${time(strikes[0].strike.expiration, 'R')}.`, ephemeral: true })
  }
}

export default Stream
