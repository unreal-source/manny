import { SlashCommand } from 'hiei.js'

class BotPing extends SlashCommand {
  constructor () {
    super({
      name: 'ping',
      description: 'Check the bot\'s latency and websocket heartbeat'
    })
  }

  async run (interaction) {
    const response = await interaction.reply({ content: ':ping_pong: Ping...', ephemeral: true, fetchReply: true })
    const heartbeat = this.client.ws.ping
    const latency = response.createdTimestamp - interaction.createdTimestamp

    return interaction.editReply({ content: `:ping_pong: Ping... Pong! Roundtrip latency is \`${latency}ms\`. Heartbeat is \`${heartbeat}ms\`.` })
  }
}

export default BotPing
