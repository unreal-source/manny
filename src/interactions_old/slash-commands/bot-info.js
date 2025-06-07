import { SlashCommand } from 'hiei.js'
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { time } from '@discordjs/builders'
import metadata from '../../../package.json'
import log from '../../utilities/logger.js'

class BotInfo extends SlashCommand {
  constructor () {
    super({
      name: 'bot',
      description: 'Learn more about Manny',
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    const description = this.client.application.description ? `${this.client.application.description}\n—` : ''
    const links = `[Source Code](${process.env.BOT_SOURCE_LINK}) • [Report a Bug](${process.env.BOT_ISSUES_LINK}) • [Contribute](${process.env.BOT_CONTRIBUTE_LINK})`
    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024)
    const info = new EmbedBuilder()
      .setTitle(this.client.user.tag)
      .setDescription(`${description}\n**Version:** ${metadata.version}\n**Last Login:** ${time(this.client.readyAt)} • ${time(this.client.readyAt, 'R')}\n**Heartbeat:** ${this.client.ws.ping}ms\n**Memory Usage:** ${Math.round(memoryUsed * 100) / 100} MB\n—\n${links}`)
      .setThumbnail(this.client.user.displayAvatarURL())

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ embeds: [info] })
  }
}

export default BotInfo
