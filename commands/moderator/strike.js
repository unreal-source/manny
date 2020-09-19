import { Command } from 'discord-akairo'
import { DateTime } from 'luxon'
import config from '../../config'
import formatDate from '../../utilities/formatDate'
import InfractionHistory from '../../models/Infractions'
import ms from 'ms'

class StrikeCommand extends Command {
  constructor () {
    super('strike', {
      aliases: ['strike'],
      category: 'Moderation',
      description: {
        name: 'Give Strike',
        content: 'Give a user a strike.',
        usage: '!strike <user> <reason>'
      },
      channel: 'guild',
      memberPermissions: ['BAN_MEMBERS']
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
      prompt: {
        start: 'Why are you giving this user a strike?',
        retry: 'Please add a reason for this strike.'
      }
    }

    return { member, reason }
  }

  async exec (message, { member, reason }) {
    if (member.id === message.author.id) {
      return message.channel.send(`${config.emoji.warning} You can't give yourself a strike.`)
    }

    if (member.id === this.client.user.id) {
      return message.channel.send(`${config.emoji.warning} You can't give me a strike.`)
    }

    const logChannel = this.client.channels.cache.get(config.logs.modLog)
    const now = DateTime.local().toISO()
    const strike = {
      action: 'strike',
      date: now,
      executor: message.author.tag,
      reason: reason
    }

    const history = await InfractionHistory.findOne({
      where: { user_id: member.id }
    })

    if (history) {
      const strikes = history.strikes
      strikes.push(strike)
      await InfractionHistory.update({
        strikes: strikes
      }, {
        where: { user_id: member.id }
      })

      // Strike 1
      if (strikes.length === 1) {
        const muteDuration = ms('10s')
        const muteRole = await message.guild.roles.cache.find(role => role.name === 'Muted')
        const mutedMember = await member.roles.add(muteRole)
        const timer = setTimeout(() => {
          mutedMember.roles.remove(muteRole)

          const muteExpiredLog = this.client.util.embed()
            .setColor(config.embedColors.yellow)
            .setTitle(`${config.emoji.expired} Mute expired on __${member.user.tag}__`)
            .setFooter(formatDate(now))

          logChannel.send({ embed: muteExpiredLog })
        }, muteDuration)

        this.client.mutes.set(member.id, timer)

        const strikeLog = this.client.util.embed()
          .setColor(config.embedColors.orange)
          .setTitle(`${config.emoji.strike} __${member.user.tag}__ received their 1st strike from __${message.author.tag}__`)
          .setDescription(`Reason: ${reason}\n\`\`\`User muted for ${ms(muteDuration, { long: true })}\`\`\``)
          .setFooter(formatDate(now))

        return logChannel.send({ embed: strikeLog })
      }

      // Strike 2
      if (strikes.length === 2) {
        const muteDuration = ms('20s')
        const muteRole = await message.guild.roles.cache.find(role => role.name === 'Muted')
        const mutedMember = await member.roles.add(muteRole)
        const timer = setTimeout(() => {
          mutedMember.roles.remove(muteRole)

          const muteExpiredLog = this.client.util.embed()
            .setColor(config.embedColors.yellow)
            .setTitle(`${config.emoji.expired} Mute expired on __${member.user.tag}__`)
            .setFooter(formatDate(now))

          logChannel.send({ embed: muteExpiredLog })
        }, muteDuration)

        this.client.mutes.set(member.id, timer)

        const strikeLog = this.client.util.embed()
          .setColor(config.embedColors.orange)
          .setTitle(`${config.emoji.strike} __${member.user.tag}__ received their 2nd strike from __${message.author.tag}__`)
          .setDescription(`Reason: ${reason}\n\`\`\`User muted for ${ms(muteDuration, { long: true })}\`\`\``)
          .setFooter(formatDate(now))

        return logChannel.send({ embed: strikeLog })
      }

      // Strike 3
      if (strikes.length === 3) {
        const bannedMember = await message.guild.members.ban(member, { reason: reason })
        const ban = {
          action: 'ban',
          date: now,
          executor: message.author.tag,
          reason: 'Received 3 strikes'
        }

        const bans = history.bans
        bans.push(ban)
        await InfractionHistory.update({
          bans: bans
        }, {
          where: { user_id: member.id }
        })

        message.channel.send(`${bannedMember} was banned from the server.`)

        const strikeLog = this.client.util.embed()
          .setColor(config.embedColors.orange)
          .setTitle(`${config.emoji.strike} __${member.user.tag}__ received their 3rd strike from __${message.author.tag}__`)
          .setDescription(`Reason: ${reason}\n\`\`\`User banned from the server\`\`\``)
          .setFooter(formatDate(now))

        return logChannel.send({ embed: strikeLog })
      }
    }

    await InfractionHistory.create({
      user_id: member.id,
      mutes: [],
      strikes: [strike],
      bans: []
    })

    // Strike 1 with no history
    const muteDuration = ms('10s')
    const muteRole = await message.guild.roles.cache.find(role => role.name === 'Muted')
    const mutedMember = await member.roles.add(muteRole)
    const timer = setTimeout(() => {
      mutedMember.roles.remove(muteRole)

      const muteExpiredLog = this.client.util.embed()
        .setColor(config.embedColors.yellow)
        .setTitle(`${config.emoji.expired} Mute expired on __${member.user.tag}__`)
        .setFooter(formatDate(now))

      logChannel.send({ embed: muteExpiredLog })
    }, muteDuration)

    this.client.mutes.set(member.id, timer)

    const strikeLog = this.client.util.embed()
      .setColor(config.embedColors.orange)
      .setTitle(`${config.emoji.strike} __${member.user.tag}__ received their 1st strike from __${message.author.tag}__`)
      .setDescription(`Reason: ${reason}\n\`\`\`User muted for ${ms(muteDuration, { long: true })}\`\`\``)
      .setFooter(formatDate(now))

    return logChannel.send({ embed: strikeLog })
  }
}

export default StrikeCommand
