import { Command } from 'discord-akairo'
import config from '../../config'
import { DateTime } from 'luxon'
import { Signale } from 'signale'

const log = new Signale({
  scope: 'Test'
})

class TestCommand extends Command {
  constructor () {
    super('test', {
      aliases: ['test', 't'],
      category: 'Developer',
      description: {
        name: 'Test',
        content: 'Debug command for testing embed designs.',
        usage: '!test'
      },
      channel: 'guild',
      ownerOnly: true
    })
  }

  * args () {
    const design = yield { type: 'string' }

    return { design }
  }

  async exec (message, { design }) {
    const timestamp = DateTime.local().toLocaleString(DateTime.DATETIME_FULL)
    const embed = this.client.util.embed()

    switch (design) {
      case 'mute':
        embed
          .setColor(config.embeds.colors.yellow)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.mute} Member muted for 10 minutes`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Reason', 'Arguing and shouting')
          .setFooter('#1')
          .setTimestamp()
        break
      case 'unmute':
        embed
          .setColor(config.embeds.colors.blue)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.undo} Member unmuted`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Reason', 'Had time to cool off')
          .setFooter('#17')
          .setTimestamp()
        break
      case 'expired':
        embed
          .setColor(config.embeds.colors.yellow)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.expired} Mute expired`)
          .setTimestamp()
        break
      case 'strike':
        embed
          .setColor(config.embeds.colors.orange)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.strike} Strike added`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Reason', 'Advertising')
          .setFooter('#747')
          .setTimestamp()
        break
      case 'pardon':
        embed
          .setColor(config.embeds.colors.blue)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.undo} 1 strike removed`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Reason', 'Gave it to the wrong member')
          .setFooter('#3305')
          .setTimestamp()
        break
      case 'ban':
        embed
          .setColor(config.embeds.colors.red)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.ban} Member banned`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Reason', 'Being a terrible person')
          .setFooter('#34')
          .setTimestamp()
        break
      case 'unban':
        embed
          .setColor(config.embeds.colors.blue)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.undo} Member unbanned`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Reason', 'Learned to behave')
          .setFooter('#34')
          .setTimestamp()
        break
      case 'purge':
        embed
          .setTitle(`${config.prefixes.purge} 15 messages deleted`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Channel', `#${message.channel.name}`)
          .setTimestamp()
        break
      case 'purge-author':
        embed
          .setTitle(`${config.prefixes.purge} 6 messages deleted`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Channel', `#${message.channel.name}`)
          .addField('Author', message.author.tag)
          .setTimestamp()
        break
      case 'reason':
        embed
          .setColor(config.embeds.colors.blue)
          .setTitle(`${config.prefixes.edit} Reason edited for case #1457`)
          .setDescription('by Cedric \'eXi\' Neukirchen#4538')
          .addField('Old Reason', '`No reason given`')
          .addField('New Reason', 'Advertising')
          .setTimestamp()
        break
      case 'history':
        embed
          .setAuthor('Infraction History')
          .setTitle('**Cedric \'eXi\' Neukirchen#4538**')
          .setDescription('1 Mute • 2 Strikes (1 Active) • 0 Bans')
          .setThumbnail(message.author.displayAvatarURL())
        break
      case 'history-more':
        embed
          .setAuthor(message.author.tag)
          .setTitle(`${config.prefixes.info} Infraction History`)
          .setDescription('1 Mute • 2 Strikes • 0 Bans')
          .setThumbnail(message.author.displayAvatarURL())
          .addField('Mutes', `${config.prefixes.mute} **Muted for 10m by Cedric 'eXi' Neukirchen#4538**\nReason: Arguing and shouting\n${timestamp}`)
          .addField('Strikes', `${config.prefixes.strike} **Strike added by Cedric 'eXi' Neukirchen#4538**\nReason: Advertising\n${timestamp}`)
          .addField('Bans', `${config.prefixes.ban} **Banned by Cedric 'eXi' Neukirchen#4538**\nReason: Being a terrible person\n${timestamp}`)
        break
      case 'mutes':
        log.debug(this.client.mutes)
    }

    return message.channel.send({ embed })
  }
}

export default TestCommand
