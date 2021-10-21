import { SlashCommand } from 'hiei.js'
import ms from 'ms'

class Uptime extends SlashCommand {
  constructor () {
    super({
      name: 'uptime',
      description: 'Check how long it\'s been since the last time the bot logged in'
    })
  }

  run (interaction) {
    const uptime = ms(this.client.uptime)
    return interaction.reply({ content: `:stopwatch: I have been online for ${uptime}`, ephemeral: true })
  }
}

export default Uptime
