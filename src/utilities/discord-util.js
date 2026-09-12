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
