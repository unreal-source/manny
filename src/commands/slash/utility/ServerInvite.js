import { SlashCommand } from 'hiei.js'

class ServerInvite extends SlashCommand {
  constructor () {
    super({
      name: 'invite',
      description: 'Get the server\'s invite link'
    })
  }

  async run (interaction) {
    return interaction.reply({ content: `https://discord.gg/${interaction.guild.vanityURLCode}` })
  }
}

export default ServerInvite
