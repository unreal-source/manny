import { InteractionCollector, InteractionType } from 'discord.js'

/** Create a modal submission collector
 * @param {client} client - The client on which to collect interactions
 * @param {interaction} interaction - The interaction that created the modal
*/
export function createModalCollector (client, interaction) {
  return new InteractionCollector(client, {
    channel: interaction.channel,
    guild: interaction.guild,
    interactionType: InteractionType.modalSubmit,
    max: 1
  })
}

/** Detect whether a member is an admin or moderator
 * @param {member} member - The guild member
*/
export function isStaff (member) {
  const isAdmin = member.roles.cache.some(role => role.id === process.env.ADMIN_ROLE)
  const isModerator = member.roles.cache.some(role => role.id === process.env.MODERATOR_ROLE)

  return isAdmin || isModerator
}

/** Detect whether a member has an old (Username#1234) or new (@username) username and return it in the correct format
 * @param {member} member - The guild member
*/
export function getUsername (member) {
  // Is this a guild member or a user?
  if (member.user) {
    // Have they claimed a new username?
    if (member.user.tag.endsWith('#0')) {
      return member.user.username
    } else {
      return member.user.tag
    }
  } else {
    if (member.tag.endsWith('#0')) {
      return member.username
    } else {
      return member.tag
    }
  }
}
