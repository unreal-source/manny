import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'
import ms from 'ms'

class StrikeCommand extends Command {
  constructor () {
    super('strike', {
      aliases: ['strike'],
      category: 'Moderator',
      description: {
        name: 'Strike',
        short: 'Give a strike to a user.',
        long: 'Give a strike to a user. This action is recorded in the mod log.',
        syntax: '!strike user reason',
        args: {
          user: 'The user you want to give a strike to. Can be a name, mention, or ID.',
          reason: 'The reason this user is getting a strike.'
        }
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const member = yield {
      type: 'member',
      prompt: {
        start: 'Which user do you want to give a strike to?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      default: '`No reason given`'
    }

    return { member, reason }
  }

  async exec (message, { member, reason }) {
    if (member.id === message.author.id) {
      return message.util.send(`${config.emoji.warning} You can't give yourself a strike.`)
    }

    if (member.id === this.client.user.id) {
      return message.util.send(`${config.emoji.warning} Nice try, human.`)
    }

    if (member.deleted) {
      return message.util.send(`${config.emoji.warning} ${member.user.tag} is no longer a member of this server.`)
    }

    try {
      const record = await Case.create({
        action: 'strike',
        user: member.user.tag,
        userID: member.id,
        moderator: message.author.tag,
        moderatorID: message.author.id,
        reason: reason,
        active: true,
        timestamp: DateTime.local()
      })

      const strikeCount = await Case.count({
        where: {
          action: 'strike',
          userID: member.id,
          active: true
        }
      })

      const logChannel = this.client.channels.cache.get(config.logs.channels.modLog)
      const logEntry = this.client.util.embed()
        .setColor(config.embeds.colors.orange)
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`${config.prefixes.strike} Strike added`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      const receipt = this.client.util.embed()
        .setColor(config.embeds.colors.orange)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`${config.prefixes.strike} You received a strike`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      if (strikeCount === 1 || strikeCount === 2) {
        const muteDuration = ms(config.infractions.muteLevels[strikeCount])
        const muteDurationLong = ms(muteDuration, { long: true })

        if (member.roles.cache.some(role => role.id === config.infractions.muteRole)) {
          await Mute.update({
            expiration: DateTime.fromMillis(DateTime.local() + muteDuration)
          }, {
            where: { id: member.id }
          })
        } else {
          const muteRole = await message.guild.roles.fetch(config.infractions.muteRole)
          await member.roles.add(muteRole)

          await Mute.create({
            id: member.id,
            expiration: DateTime.fromMillis(DateTime.local() + muteDuration)
          })
        }

        await Strike.create({
          id: record.id,
          userID: member.id,
          expiration: DateTime.local().plus({ days: 30 })
        })

        logEntry.addField('Punishment', `Muted for ${muteDurationLong}`)
        await logChannel.send({ embed: logEntry })

        receipt.setDescription(`As a result, you have been muted for ${muteDurationLong}.`)
        return member.send({ embed: receipt })
      }

      if (strikeCount === 3) {
        // Send receipt first since we can't DM the member after they're banned
        receipt.setDescription('As a result, you have been banned from the server.')
        await member.send({ embed: receipt })

        await message.guild.members.ban(member, { reason: reason })

        logEntry.addField('Punishment', 'Banned from the server')
        return logChannel.send({ embed: logEntry })
      }
    } catch (e) {
      this.client.log.error(e)
    }
  }
}

export default StrikeCommand
