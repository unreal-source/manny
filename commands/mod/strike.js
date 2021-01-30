import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import Case from '../../models/cases'
import Mute from '../../models/mutes'
import Strike from '../../models/strikes'
import ms from 'ms'
import _ from '../../utilities/Util'

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
      clientPermissions: ['EMBED_LINKS', 'MOVE_MEMBERS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const member = yield {
      type: 'member',
      prompt: {
        start: 'Which user do you want to give a strike to?',
        retry: 'User not found. Please enter a name, mention, or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      default: '`No reason given`'
    }

    return { member, reason }
  }

  async exec (message, { member, reason }) {
    await message.delete()

    if (member.id === message.author.id) {
      return message.util.send(`${_.prefix('warning')} You can't give yourself a strike.`)
    }

    if (member.id === this.client.user.id) {
      return message.util.send(`${_.prefix('warning')} Nice try, human.`)
    }

    if (member.deleted) {
      return message.util.send(`${_.prefix('warning')} ${member.user.tag} is no longer a member of this server.`)
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

      const logChannel = this.client.channels.cache.get(config.channels.logs.modLog)
      const logEntry = this.client.util.embed()
        .setColor(_.color('orange'))
        .setAuthor(member.user.tag)
        .setThumbnail(member.user.displayAvatarURL())
        .setTitle(`${_.prefix('strike')} Strike added`)
        .setDescription(`by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      const receipt = this.client.util.embed()
        .setColor(_.color('orange'))
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`${_.prefix('strike')} You received a strike`)
        .addField('Reason', reason)
        .setFooter(`#${record.id}`)
        .setTimestamp()

      if (strikeCount === 1 || strikeCount === 2) {
        const muteDuration = ms(config.strikes.muteLevels[strikeCount])
        const muteDurationLong = ms(muteDuration, { long: true })

        if (member.roles.cache.some(role => role.id === config.roles.muted)) {
          await Mute.update({
            expiration: DateTime.fromMillis(DateTime.local() + muteDuration)
          }, {
            where: { id: member.id }
          })
        } else {
          const muteRole = await message.guild.roles.fetch(config.roles.muted)
          await member.roles.add(muteRole)

          await Mute.create({
            id: member.id,
            user: member.user.tag,
            expiration: DateTime.fromMillis(DateTime.local() + muteDuration)
          })
        }

        await Strike.create({
          id: record.id,
          userID: member.id,
          expiration: DateTime.local().plus({ days: 30 })
        })

        if (member.voice.channel !== null) {
          await member.voice.kick()
        }

        logEntry.addField('Punishment', `Muted for ${muteDurationLong}`)
        await logChannel.send({ embed: logEntry })

        receipt.setDescription(`As a result, you were muted for ${muteDurationLong}.`)
        await member.send({ embed: receipt })

        return message.util.send(`${_.prefix('strike')} **${member.user.tag}** received strike ${strikeCount}. As a result, they were muted for ${muteDurationLong}.`)
      }

      if (strikeCount === 3) {
        // Send receipt first since we can't DM the member after they're banned
        receipt.setDescription('As a result, you were banned from the server.')
        await member.send({ embed: receipt })

        await message.guild.members.ban(member, { reason: reason })

        logEntry.addField('Punishment', 'Banned from the server')
        await logChannel.send({ embed: logEntry })
        return message.util.send(`${_.prefix('strike')} **${member.user.tag}** received strike 3. As a result, they were banned.`)
      }
    } catch (e) {
      await message.channel.send('Something went wrong. Check the logs for details.')
      return this.client.log.error(e)
    }
  }
}

export default StrikeCommand
