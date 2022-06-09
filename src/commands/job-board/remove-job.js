import { MessageCommand } from 'hiei.js'

class RemoveJob extends MessageCommand {
  constructor () {
    super({
      name: 'Remove Job'
    })
  }

  async run (interaction, message) {
    if (message.content.includes(interaction.member.id)) {
      await message.delete()

      return interaction.reply({ content: 'Job post successfully removed', ephemeral: true })
    }

    return interaction.reply({ content: 'You must be the author of a job post to remove it.', ephemeral: true })
  }
}

export default RemoveJob
