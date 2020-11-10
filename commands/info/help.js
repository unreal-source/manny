import { Command } from 'discord-akairo'
import config from '../../config'

class HelpCommand extends Command {
  constructor () {
    super('help', {
      aliases: ['help'],
      category: 'Info',
      description: {
        name: 'Help',
        short: 'Get a list of available commands.',
        long: 'Get a list of available commands. Optionally learn more about a command.',
        syntax: '!help command',
        args: {
          command: 'The command you want to learn about.'
        }
      },
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
    })
  }

  * args () {
    const command = yield {
      type: 'command',
      optional: true,
      prompt: {
        retry: 'Command not found. Please enter the name of a valid command.',
        optional: true
      }
    }

    return { command }
  }

  exec (message, { command }) {
    const member = this.client.guilds.cache.first().member(message.author)
    const embed = this.client.util.embed()
      .setTitle('Command List')
      .setDescription(`Say \`${config.commands.defaultPrefix}help [command]\` to learn more about a command. Example: \`${config.commands.defaultPrefix}help ping\``)

    if (!command) {
      const categories = this.handler.categories.values()

      for (const category of categories) {
        const availableCommands = category.filter(cmd => member.permissions.has(cmd.userPermissions))

        if (availableCommands.size !== 0) {
          const commandList = availableCommands.map(cmd => `**${cmd.prefix ? cmd.prefix : config.commands.defaultPrefix}${cmd.aliases[0]}** - ${cmd.description.short}`).join('\n')

          embed.addField(`${category.id} Commands`, commandList)
        }
      }
    }

    if (command && member.permissions.has(command.userPermissions)) {
      let argsList = ''

      if (command.description.args) {
        for (const [key, value] of Object.entries(command.description.args)) {
          argsList += `**${key}** - ${value}\n`
        }
      }

      embed
        .setTitle(command.description.name)
        .setDescription(`${command.description.long ? command.description.long : command.description.short}\n\`\`\`${command.description.syntax}\`\`\`\n${argsList}`)
    }

    // Always send the command list in a direct message
    if (message.channel.type !== 'dm') {
      message.reply('I sent you a DM with more information.')
    }

    return message.author.send({ embed })
  }
}

export default HelpCommand
