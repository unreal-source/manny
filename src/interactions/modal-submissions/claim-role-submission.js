import { ModalSubmission } from 'hiei.js'
import prisma from '../../utilities/prisma-client.js'

class ClaimRoleSubmission extends ModalSubmission {
  constructor () {
    super({
      id: 'claimRoleModal'
    })
  }

  async run (interaction) {
    await interaction.deferReply({ ephemeral: true })

    const email = interaction.fields.getTextInputValue('email')
    const supporter = await prisma.supporter.findFirst({
      where: {
        ghostEmail: email
      }
    })

    if (supporter) {
      const hasRole = interaction.member.roles.cache.some(role => role.id === process.env.SUPPORTER_ROLE)

      if (hasRole) {
        return interaction.followUp({ content: 'You have already claimed your role.' })
      } else {
        await prisma.supporter.update({
          where: { ghostEmail: email },
          data: { discordId: interaction.member.id }
        })

        await interaction.member.roles.add(process.env.SUPPORTER_ROLE)

        return interaction.followUp({ content: `You now have the Supporter role. Thanks for your support, ${supporter.ghostName}!` })
      }
    }

    return interaction.followUp({ content: 'Email not found. You must sign up for a paid membership on our website to claim the exclusive Discord role.' })
  }
}

export default ClaimRoleSubmission
