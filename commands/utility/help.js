import { Command } from 'discord-akairo'
import config from '../../quin.config.js'

class HelpCommand extends Command {
  constructor () {
    super('help', {
      aliases: ['help'],
      category: 'Utility',
      description: {
        content: 'Get a list of commands for the bot.',
        usage: '!help [command]'
      },
      userPermissions: ['SEND_MESSAGES']
    })
  }

  * args () {
    const command = yield {
      type: 'command',
      optional: true,
      prompt: {
        start: 'Which command do you need help with?',
        retry: 'That is not a valid command. Please try again.',
        optional: true
      }
    }

    return { command }
  }

  exec (message, { command }) {
    // Get the user as a guild member
    const member = this.client.guilds.cache.first().member(message.author)

    // Initialize embed
    const embed = this.client.util.embed()
      .setColor(config.embedColors.violet)
      .setTitle('Command List')

    // !help - List all commands available to the user
    if (!command) {
      const categories = this.handler.categories.values()

      for (const category of categories) {
        const availableCommands = category.filter(cmd => member.permissions.has(cmd.userPermissions))

        if (availableCommands.size !== 0) {
          const commandList = availableCommands.map(cmd => `**${cmd.prefix ? cmd.prefix : this.client.config.defaultPrefix}${cmd.aliases[0]}** - ${cmd.description.content}`).join('\n')

          embed.addField(`${category.id} Commands`, commandList)
        }
      }

      embed.setFooter(`Say ${this.client.config.defaultPrefix}help [command] to learn more about a command. Example: ${this.client.config.defaultPrefix}help ping`)
    }

    // !help [command] - Give more information about a command
    if (member.permissions.has(command.userPermissions)) {
      embed
        .setTitle(command.description.name)
        .setDescription(command.description.content)
        .addField('Usage', `\`\`\`${command.description.usage}\`\`\``)
    }

    if (message.channel.type !== 'dm') {
      message.reply('I sent you a DM with more information.')
    }

    return message.author.send({ embed })
  }
}

export default HelpCommand
