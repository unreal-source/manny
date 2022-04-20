import { SlashCommand } from 'hiei.js'
import { importJson } from '../../utilities/json-util.js'
import { resolve } from 'node:path'

class BotVersion extends SlashCommand {
  constructor () {
    super({
      name: 'version',
      description: 'Check which version of the bot is running'
    })
  }

  async run (interaction) {
    const meta = await importJson(resolve(process.cwd(), 'package.json'))
    return interaction.reply({ content: `Current version is \`${meta.version}\``, ephemeral: true })
  }
}

export default BotVersion
