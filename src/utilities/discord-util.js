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
