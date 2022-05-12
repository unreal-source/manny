import { SlashCommand } from 'hiei.js'
import { EmbedBuilder } from 'discord.js'
import { time } from '@discordjs/builders'
import { importJson } from '../../utilities/json-util.js'
import ms from 'ms'
import { resolve } from 'node:path'

class BotInfo extends SlashCommand {
  constructor () {
    super({
      name: 'bot',
      description: 'Learn more about Manny'
    })
  }

  async run (interaction) {
    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024)
    const meta = await importJson(resolve(process.cwd(), 'package.json'))
    const info = new EmbedBuilder()
      .setTitle(this.client.user.tag)
      .setDescription(this.client.application.description ? this.client.application.description : '')
      .setThumbnail(this.client.user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: this.client.user.id, inline: true },
        { name: 'Version', value: meta.version, inline: true },
        { name: 'Last Login', value: `${time(this.client.readyAt)} • ${time(this.client.readyAt, 'R')}` },
        { name: 'Uptime', value: ms(this.client.uptime, { long: true }), inline: true },
        { name: 'Heartbeat', value: `${this.client.ws.ping}ms`, inline: true },
        { name: 'Memory Usage', value: `${Math.round(memoryUsed * 100) / 100} MB`, inline: true },
        { name: 'Links', value: `[Source code](${process.env.BOT_REPO_LINK}) • [Report a bug](${process.env.BOT_BUGS_LINK}) • [Contribute](${process.env.BOT_CONTRIBUTE_LINK})` })

    return interaction.reply({ embeds: [info] })
  }
}

export default BotInfo
