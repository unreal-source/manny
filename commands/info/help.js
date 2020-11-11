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

    if (!command) {
      const categories = this.handler.categories.values()
      const help = this.client.util.embed()
        .setTitle('Command List')
        .setDescription(`Say \`${config.commands.defaultPrefix}help [command]\` to learn more about a command. Example: \`${config.commands.defaultPrefix}help ping\``)

      for (const category of categories) {
        const commands = category.filter(cmd => member.permissions.has(cmd.userPermissions))

        if (commands.size !== 0) {
          const commandList = commands.map(cmd => `**${cmd.prefix ? cmd.prefix : config.commands.defaultPrefix}${cmd.aliases[0]}** - ${cmd.description.short}`).join('\n')

          help.addField(`${category.id} Commands`, commandList)
        }
      }

      message.author.send({ embed: help })

      if (message.channel.type !== 'dm') {
        return message.reply('Check your direct messages. :incoming_envelope:')
      }
    }

    if (command && member.permissions.has(command.userPermissions)) {
      const argumentList = command.description.args ? Object.entries(command.description.args).map(([key, value]) => `**${key}** - ${value}`).join('\n') : ''
      const help = this.client.util.embed()
        .setTitle(command.description.name)
        .setDescription(`${command.description.long ? command.description.long : command.description.short}\n\`\`\`${command.description.syntax}\`\`\`\n${argumentList}`)

      message.author.send({ embed: help })

      if (message.channel.type !== 'dm') {
        return message.reply('Check your direct messages. :incoming_envelope:')
      }
    }
  }
}

export default HelpCommand
