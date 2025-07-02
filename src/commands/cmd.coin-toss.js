import { PermissionFlagsBits } from 'discord.js'
import { randomWeighted } from '../utilities/random-util.js'
import { dedent } from '../utilities/string-util.js'

export default {
  interaction: 'slash',
  name: 'coin',
  description: 'Toss a coin and let fate guide you.',
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  async execute ({ interaction }) {
    const buildup = [
      { outcome: 'It glints in the light as it falls straight into your palm:', weight: 40 },
      { outcome: 'It slips through your fingers and bounces once — twice — before finally toppling over:', weight: 40 },
      { outcome: 'It spins wildly before collapsing on the desk in front of you:', weight: 40 },
      { outcome: 'A firm flip. A perfect arc. The result:', weight: 20 },
      { outcome: 'Eager to know the answer, you catch the coin mid-air and open your hand:', weight: 10 },
      { outcome: 'The coin seems to fall in slow motion. You begin to sweat with anticipation. Will it ever land? Will you ever know the answer?! Finally, after waiting for an eternity:', weight: 5 },
      { outcome: 'As it tumbles through the air, you get lost in its beauty. The tasteful thickness of it. Oh my god. It even has a watermark:', weight: 1 }
    ]

    const choices = [
      { outcome: `${randomWeighted(buildup)} ||Heads||`, weight: 45 },
      { outcome: `${randomWeighted(buildup)} ||Tails||`, weight: 45 },
      { outcome: 'The coin flew off into the void. Chaos strikes again!', weight: 10 },
      { outcome: 'The coin passes right through your hand, and then the floor. You forgot to enable collision.', weight: 10 },
      { outcome: 'The coin was snatched by a passing raven. Try again.', weight: 2 },
      { outcome: 'The coin lands... _on its edge_. Impossible, yet here we are.', weight: 1 }
    ]

    return interaction.reply({
      content: dedent`
        ## :coin: You toss a coin high in the air...
        ${randomWeighted(choices)}`
    })
  }
}
