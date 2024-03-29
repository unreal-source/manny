import { SlashCommand } from 'hiei.js'
import { PermissionFlagsBits } from 'discord.js'
import log from '../../utilities/logger.js'

class BotPing extends SlashCommand {
  constructor () {
    super({
      name: 'ping',
      description: 'Check the bot\'s latency and websocket heartbeat',
      defaultMemberPermissions: PermissionFlagsBits.BanMembers
    })
  }

  async run (interaction) {
    const response = await interaction.reply({ content: ':ping_pong: Ping...', ephemeral: true, fetchReply: true })
    const heartbeat = this.client.ws.ping
    const latency = response.createdTimestamp - interaction.createdTimestamp

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    return interaction.editReply({ content: `:ping_pong: Ping... Pong! Roundtrip latency is \`${latency}ms\`. Heartbeat is \`${heartbeat}ms\`.` })
  }
}

export default BotPing
