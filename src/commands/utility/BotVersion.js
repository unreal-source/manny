import { SlashCommand } from 'hiei.js'
import { readFile } from 'node:fs/promises'

class BotVersion extends SlashCommand {
  constructor () {
    super({
      name: 'version',
      description: 'Check which version of the bot is running'
    })
  }

  async run (interaction) {
    const meta = JSON.parse(await readFile(new URL('../../../../package.json', import.meta.url)))
    return interaction.reply({ content: `Current version is \`${meta.version}\``, ephemeral: true })
  }
}

export default BotVersion
