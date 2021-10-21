import { SlashCommand } from 'hiei.js'

class Ping extends SlashCommand {
  constructor () {
    super({
      name: 'ping',
      description: 'Check the bot\'s latency.'
    })
  }

  run (interaction) {
    return interaction.reply({ content: ':ping_pong: Pong!' })
  }
}

export default Ping
