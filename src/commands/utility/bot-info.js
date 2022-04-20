import { SlashCommand } from 'hiei.js'
import { MessageEmbed } from 'discord.js'
import { time } from '@discordjs/builders'
import { importJson } from '../../utilities/json-util.js'
import ms from 'ms'
import { resolve } from 'node:path'

class BotInfo extends SlashCommand {
  constructor () {
    super({
      name: 'bot',
      description: 'Learn more about the bot'
    })
  }

  async run (interaction) {
    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024)
    const meta = await importJson(resolve(process.cwd(), 'package.json'))
    const info = new MessageEmbed()
      .setTitle(this.client.user.tag)
      .setDescription(this.client.application.description ? this.client.application.description : '')
      .setThumbnail(this.client.user.displayAvatarURL())
      .addField('ID', this.client.user.id, true)
      .addField('Version', meta.version, true)
      .addField('Last Login', `${time(this.client.readyAt)} • ${time(this.client.readyAt, 'R')}`)
      .addField('Uptime', ms(this.client.uptime, { long: true }), true)
      .addField('Heartbeat', `${this.client.ws.ping}ms`, true)
      .addField('Memory Usage', `${Math.round(memoryUsed * 100) / 100} MB`, true)
      .addField('Links', `[Source code](${process.env.BOT_REPO_LINK}) • [Report a bug](${process.env.BOT_BUGS_LINK}) • [Contribute](${process.env.BOT_CONTRIBUTE_LINK})`)

    return interaction.reply({ embeds: [info] })
  }
}

export default BotInfo
