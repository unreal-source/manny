import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../bot.config'
import InfractionHistory from '../../models/Infractions'

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
      category: 'Moderation',
      description: {
        name: 'Unmute User',
        content: 'Unmute a user, restoring their ability to send messages.',
        usage: '!unmute <user> <reason>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const member = yield {
      type: 'member',
      prompt: {
        start: 'Which user do you want to unmute?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you unmuting this user?',
        retry: 'Please add a reason for unmuting this user.'
      }
    }

    return { member, reason }
  }

  async exec (message, { member, reason }) {
    if (member.id === message.author.id) {
      return message.channel.send(`${config.emoji.warning} You cannot unmute yourself.`)
    }

    if (member.id === this.client.user.id) {
      return message.channel.send(`${config.emoji.warning} You cannot unmute me.`)
    }

    if (!member.roles.cache.some(role => role.name === 'Muted')) {
      return message.channel.send(`${config.emoji.warning} That user is not muted.`)
    }

    const role = await message.guild.roles.cache.find(role => role.name === 'Muted')
    const unmuted = await member.roles.remove(role)

    clearTimeout(this.client.mutes.get(member.id))
    this.client.mutes.delete(member.id)

    message.channel.send(`You unmuted ${unmuted}.`)

    const now = DateTime.local().toISO()
    const unmute = {
      action: 'unmute',
      date: now,
      executor: message.author.tag,
      reason: reason
    }

    const history = await InfractionHistory.findOne({
      where: { user_id: member.id }
    })

    if (history) {
      const mutes = history.mutes
      mutes.push(unmute)
      await InfractionHistory.update({
        mutes: mutes
      }, {
        where: { user_id: member.id }
      })
    } else {
      await InfractionHistory.create({
        user_id: member.id,
        mutes: [unmute],
        strikes: [],
        bans: []
      })
    }

    const logChannel = this.client.channels.cache.get(config.logs.modLog)
    const embed = this.client.util.embed()
      .setColor(config.embedColors.yellow)
      .setTitle(`${config.emoji.undo} __${member.user.tag}__ was unmuted by __${message.author.tag}__`)
      .setDescription(`Reason: ${reason}`)
      .setFooter(DateTime.fromISO(now).toLocaleString(DateTime.DATETIME_FULL))

    return logChannel.send({ embed })
  }
}

export default UnmuteCommand
