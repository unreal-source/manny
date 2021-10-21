import { SlashCommand } from 'hiei.js'

class Ping extends SlashCommand {
  constructor () {
    super({
      name: 'ping',
      description: 'Check the bot\'s latency'
    })
  }

  async run (interaction) {
    const response = await interaction.reply({ content: ':ping_pong: Ping...', ephemeral: true, fetchReply: true })
    const heartbeat = this.client.ws.ping
    const latency = response.createdTimestamp - interaction.createdTimestamp

    return interaction.editReply({ content: `:ping_pong: Ping... Pong! My heartbeat is ${heartbeat}ms. My latency is ${latency}ms` })
  }
}

export default Ping
