import { SlashCommand } from 'hiei.js'
import { PermissionFlagsBits } from 'discord.js'
import ms from 'ms'
import log from '../../utilities/logger.js'

class BotUptime extends SlashCommand {
  constructor () {
    super({
      name: 'uptime',
      description: 'Check how long the bot has been online',
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild
    })
  }

  run (interaction) {
    const uptime = ms(this.client.uptime, { long: true })

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.reply({ content: `:stopwatch: I have been online for \`${uptime}\``, ephemeral: true })
  }
}

export default BotUptime
