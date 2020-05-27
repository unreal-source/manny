import { Command } from 'discord-akairo'
import config from '../../bot.config'

class HelpCommand extends Command {
  constructor () {
    super('help', {
      aliases: ['help'],
      category: 'Info',
      description: {
        name: 'Help',
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
    const member = this.client.guilds.cache.first().member(message.author)
    const embed = this.client.util.embed()
      .setColor(config.embedColors.violet)
      .setTitle('Command List')

    // !help
    if (!command) {
      const categories = this.handler.categories.values()

      for (const category of categories) {
        const availableCommands = category.filter(cmd => member.permissions.has(cmd.userPermissions))

        if (availableCommands.size !== 0) {
          const commandList = availableCommands.map(cmd => `**${cmd.prefix ? cmd.prefix : config.defaultPrefix}${cmd.aliases[0]}** - ${cmd.description.content}`).join('\n')

          embed.addField(`${category.id} Commands`, commandList)
        }
      }

      embed.setFooter(`Say ${config.defaultPrefix}help [command] to learn more about a command. Example: ${config.defaultPrefix}help ping`)
    }

    // !help [command]
    if (command && member.permissions.has(command.userPermissions)) {
      embed
        .setTitle(command.description.name)
        .setDescription(command.description.content)
        .addField('Usage', `\`\`\`${command.description.usage}\`\`\``)
    }

    // Always send the command list in a direct message
    if (message.channel.type !== 'dm') {
      message.reply('I sent you a DM with more information.')
    }

    return message.author.send({ embed })
  }
}

export default HelpCommand
