import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../bot.config'
import formatDate from '../../utilities/formatDate'
import InfractionHistory from '../../models/Infractions'
import ms from 'ms'

class MuteCommand extends Command {
  constructor () {
    super('mute', {
      aliases: ['mute'],
      category: 'Moderation',
      description: {
        name: 'Mute User',
        content: 'Mute a user, removing their ability to send messages.',
        usage: '!mute <user> <duration> <reason>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const member = yield {
      type: 'member',
      prompt: {
        start: 'Which user do you want to mute?',
        retry: 'User not found. Please enter a valid @mention or ID.'
      }
    }

    const duration = yield {
      prompt: {
        start: 'How long should the mute last?',
        retry: 'Please enter a mute duration.'
      }
    }

    const reason = yield {
      match: 'rest',
      prompt: {
        start: 'Why are you muting this user?',
        retry: 'Please add a reason for this mute.'
      }
    }

    return { member, duration, reason }
  }

  async exec (message, { member, duration, reason }) {
    if (member.id === message.author.id) {
      return message.channel.send(`${config.emoji.warning} You cannot mute yourself.`)
    }

    if (member.id === this.client.user.id) {
      return message.channel.send(`${config.emoji.warning} You cannot mute me.`)
    }

    if (member.roles.cache.some(role => role.name === 'Muted')) {
      return message.channel.send(`${config.emoji.warning} That user is already muted.`)
    }

    const role = await message.guild.roles.cache.find(role => role.name === 'Muted')
    const muted = await member.roles.add(role)
    const logChannel = this.client.channels.cache.get(config.logs.modLog)
    const longDuration = ms(ms(duration), { long: true })
    const timer = setTimeout(() => {
      muted.roles.remove(role)
      const embed = this.client.util.embed()
        .setColor(config.embedColors.yellow)
        .setTitle(`${config.emoji.expired} Mute expired on __${member.user.tag}__`)
        .setFooter(formatDate(now))
      logChannel.send({ embed })
    }, ms(duration))

    this.client.mutes.set(member.id, timer)
    message.channel.send(`You muted ${muted} for ${longDuration}.`)

    const now = DateTime.local().toISO()
    const mute = {
      action: 'mute',
      date: now,
      duration: longDuration,
      executor: message.author.tag,
      reason: reason
    }

    const history = await InfractionHistory.findOne({
      where: { user_id: member.id }
    })

    if (history) {
      const mutes = history.mutes
      mutes.push(mute)
      await InfractionHistory.update({
        mutes: mutes
      }, {
        where: { user_id: member.id }
      })
    } else {
      await InfractionHistory.create({
        user_id: member.id,
        mutes: [mute],
        strikes: [],
        bans: []
      })
    }

    const embed = this.client.util.embed()
      .setColor(config.embedColors.yellow)
      .setTitle(`${config.emoji.mute} __${member.user.tag}__ was muted for ${longDuration} by __${message.author.tag}__`)
      .setDescription(`Reason: ${reason}`)
      .setFooter(formatDate(now))

    return logChannel.send({ embed })
  }
}

export default MuteCommand
