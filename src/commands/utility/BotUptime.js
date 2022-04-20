import { SlashCommand } from 'hiei.js'
import ms from 'ms'

class BotUptime extends SlashCommand {
  constructor () {
    super({
      name: 'uptime',
      description: 'Check how long the bot has been online'
    })
  }

  run (interaction) {
    const uptime = ms(this.client.uptime, { long: true })

    return interaction.reply({ content: `:stopwatch: I have been online for \`${uptime}\``, ephemeral: true })
  }
}

export default BotUptime
