import { MessageCommand } from 'hiei.js'

class RemovePortfolio extends MessageCommand {
  constructor () {
    super({
      name: 'Remove Portfolio'
    })
  }

  async run (interaction, message) {
    if (message.content.includes(interaction.member.id)) {
      await message.delete()

      return interaction.reply({ content: 'Portfolio successfully removed', ephemeral: true })
    }

    return interaction.reply({ content: 'You must be the author of a portfolio to remove it.', ephemeral: true })
  }
}

export default RemovePortfolio
