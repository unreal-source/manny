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
      case 'ban':
      // This is the final mod log design for v1.0
        embed
          .setColor(config.embeds.colors.red)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.ban} Banned Cedric 'eXi' Neukirchen#4538`)
          .setDescription('**Reason:** Being a terrible person')
          .setFooter(timestamp)
        break
      case 'unban':
        embed
          .setColor(config.embeds.colors.blue)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.undo} Unbanned Cedric 'eXi' Neukirchen#4538`)
          .setDescription('**Reason:** Learned from their mistakes')
          .setFooter(timestamp)
        break
      case 'mute':
        embed
          .setColor(config.embeds.colors.yellow)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.mute} Muted Cedric 'eXi' Neukirchen#4538 for 10m`)
          .setDescription('**Reason:** Being a jerk and disrupting conversations')
          .setFooter(timestamp)
        break
      case 'unmute':
        embed
          .setColor(config.embeds.colors.blue)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.undo} Unmuted Cedric 'eXi' Neukirchen#4538`)
          .addField('Reason', 'Muted the wrong person')
          .setFooter(timestamp)
        break
      case 'expired':
        embed
          .setColor(config.embeds.colors.yellow)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.expired} Mute expired`)
          .setFooter(timestamp)
        break
      case 'strike':
        embed
          .setColor(config.embeds.colors.orange)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.strike} Gave Cedric 'eXi' Neukirchen#4538 a strike`)
          .addField('Reason', 'Spamming Discord invite links')
          .setFooter(timestamp)
        break
      case 'pardon':
        embed
          .setColor(config.embeds.colors.blue)
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(message.author.defaultAvatarURL)
          .setTitle(`${config.prefixes.undo} Removed 1 strike from Cedric 'eXi' Neukirchen#4538`)
          .addField('Reason', 'Previous strike was a mistake')
          .setFooter(timestamp)
        break
      case 'history':
        embed
          .setAuthor(message.author.tag)
          .setThumbnail(message.author.displayAvatarURL())
          .setTitle(':mag_right: Infraction History')
          .setDescription('1 Mute • 2 Strikes • 0 Bans')
        break
      case 'history-verbose':
        embed
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setTitle('Infraction History')
          .setDescription('1 Mute • 2 Strikes • 0 Bans')
          .setThumbnail(message.author.displayAvatarURL())
          .addField('Mutes', `:clock2: **Muted for 1h by Cedric 'eXi' Neukirchen#4538**\nReason: Being a jerk and disrupting conversations\n${timestamp}`)
          .addField('Strikes', `:triangular_flag_on_post: **Strike given by __Cedric 'eXi' Neukirchen#4538__**\nReason: Spamming Discord invite links\n${timestamp}`)
          .addField('Bans', `:no_entry_sign: **Banned by __Cedric 'eXi' Neukirchen#4538__**\nReason: Being a terrible person\n${timestamp}`)
        break
      case 'join':
        message.channel.send(`:inbox_tray: ${message.author} joined the server`)
        break
      case 'join-new':
        message.channel.send(`:inbox_tray: ${message.author} joined the server \`NEW\``)
        break
      case 'bot':
        message.channel.send(`:robot: ${this.client.user} was added to the server \`BOT\``)
        break
      case 'leave':
        message.channel.send(`:outbox_tray: **${message.author.tag}** left the server`)
        break
      case 'purge':
        embed
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.purge} Deleted 10 messages`)
          .setDescription(`**Channel:** #${message.channel.name}`)
          .setFooter(timestamp)
        break
      case 'purge-author':
        embed
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.purge} Deleted 10 messages by Cedric 'eXi' Neukirchen#4538 `)
          .setDescription('Channel: #lecture-hall-text')
          .setFooter(timestamp)
        break
      case 'mod-log':
        embed
          .setColor(config.embeds.colors.red)
          .setAuthor('Moderator', message.author.displayAvatarURL())
          .setTitle(`${config.prefixes.ban} Banned User#1234`)
          .setDescription('Reason: Being a terrible person')
          .setFooter(timestamp)
        break
      case 'member-log':
        break
      case 'info':
        embed
          .setColor(config.embeds.colors.red)
          .setAuthor('User', message.author.displayAvatarURL())
          .setTitle(':mag_right: Info Title')
          .setDescription('Reason: Being a terrible person')
          .setFooter(timestamp)
        break
      case 'mutes':
        log.debug(this.client.mutes)
    }

    return message.channel.send({ embed })
  }
}

export default TestCommand
