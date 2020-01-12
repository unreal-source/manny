import { Command } from 'discord-akairo'

class DisableCommand extends Command {
  constructor () {
    super('disable', {
      aliases: ['disable'],
      category: 'System',
      description: {
        content: 'Disable a command.',
        usage: '!disable <command>'
      },
      channelRestriction: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      protected: true,
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          description: 'The command to disable',
          prompt: {
            start: 'Which command do you want to disable?',
            retry: `That is not a valid command. Please try again.`
          }
        }
      ]
    })
  }

  async exec (message, args) {
    // Get command object
    const command = await this.handler.modules.get(args.command.id)

    // Is the command protected?
    if (command.protected) {
      return message.util.send(`:warning: The **${args.command}** command is **protected** and can't be disabled.`)
    }

    // Is the command already disabled?
    if (!command.enabled) {
      return message.util.send(`:information_source: The **${args.command}** command is already disabled.`)
    }

    // Disable command
    await command.disable()

    // Send response
    return message.util.send(`:no_entry_sign: The **${args.command}** command is now **disabled.**`)
  }
}

export default DisableCommand
