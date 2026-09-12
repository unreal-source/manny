import { SlashCommand } from 'hiei.js'
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } from 'discord.js'
import log from '../../utilities/logger.js'

class ClaimRole extends SlashCommand {
  constructor () {
    super({
      name: 'claim',
      description: 'Claim your exclusive role for being a paid supporter',
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    const prompt = new ModalBuilder()
      .setCustomId('claimRoleModal')
      .setTitle('Claim your exclusive role')

    const emailInput = new TextInputBuilder()
      .setCustomId('email')
      .setLabel('Email')
      .setPlaceholder('Enter your subscriber email address')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(254)

    const firstRow = new ActionRowBuilder().addComponents([emailInput])

    prompt.addComponents([firstRow])

    await interaction.showModal(prompt)
  }
}

export default ClaimRole
