import { ContainerBuilder, MessageFlags, PermissionFlagsBits, TextDisplayBuilder } from 'discord.js'

export default {
  interaction: 'slash',
  name: 'ping',
  description: 'Check Manny\'s latency.',
  defaultMemberPermissions: PermissionFlagsBits.BanMembers,
  async execute ({ interaction, client }) {
    // const response = await interaction.reply({
    //   content: ':ping_pong: Ping...',
    //   flags: MessageFlags.Ephemeral,
    //   withResponse: true
    // })

    // const heartbeat = client.ws.ping
    // const heartbeatDisplay = client.ws.ping === -1 ? 'Pending...' : `${heartbeat}ms`
    // const latency = response.resource.message.createdTimestamp - interaction.createdTimestamp

    // return interaction.editReply({ content: `:ping_pong: Ping... Pong!\nManny → Discord server: \`${latency}ms\`\nDiscord API → Manny: \`${heartbeatDisplay}\`.` })
    const response = await interaction.reply({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(':ping_pong:     **Ping...**'))
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
      withResponse: true
    })

    const heartbeat = client.ws.ping
    const heartbeatDisplay = client.ws.ping === -1 ? 'Pending...' : `${heartbeat}ms`
    const roundtrip = response.resource.message.createdTimestamp - interaction.createdTimestamp

    return interaction.editReply({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`:ping_pong:     Ping... Pong! Roundtrip took **${roundtrip}ms**. Discord API heartbeat is **${heartbeatDisplay}**.`))
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
    })
  }
}
