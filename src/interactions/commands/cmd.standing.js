import { MessageFlags, PermissionFlagsBits } from 'discord.js'
import { prisma } from '../../utilities/prisma-client.js'

export default {
  interaction: 'slash',
  name: 'audit',
  description: `Audit a user's moderation history`,
  permissions: PermissionFlagsBits.BanMembers,
  options: [
    {
      type: 'user',
      name: 'user',
      description: 'The user you would like to audit',
      required: true
    }
  ],
  async execute (interaction) {
    const member = interaction.options.getMember('user')

    if (!member) {
      return interaction.reply({ content: 'That user is not in the server. If they still appear as an option, try refreshing your client.', ephemeral: true })
    }

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

    const records = await prisma.case.findMany({
      where: { memberId: member.id },
      include: { strike: true }
    })

    if (records.length !== 0) {
      return interaction.followUp({ content: `${records.length} cases found for user **${member.displayName} (${member.id})**` })
    }

    return interaction.followUp({ content: `No cases found for user **${member.displayName} (${member.id})**` })
  }
}
