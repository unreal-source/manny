import { MessageFlags, PermissionFlagsBits } from 'discord.js'

export default {
  interaction: 'slash',
  name: 'ping',
  description: 'Check Manny\'s latency.',
  defaultMemberPermissions: PermissionFlagsBits.BanMembers,
  async execute ({ interaction, client }) {
    const response = await interaction.reply({
      content: ':ping_pong: Ping...',
      flags: MessageFlags.Ephemeral,
      withResponse: true
    })

    const heartbeat = client.ws.ping
    const heartbeatDisplay = client.ws.ping === -1 ? 'Pending...' : `${heartbeat}ms`
    const latency = response.resource.message.createdTimestamp - interaction.createdTimestamp

    return interaction.editReply({ content: `:ping_pong: Ping... Pong!\nManny → Discord server: \`${latency}ms\`\nDiscord API → Manny: \`${heartbeatDisplay}\`.` })
  }
}
