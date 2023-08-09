import prisma from '../../utilities/prisma-client.js'

export default function (client) {
  return {
    method: 'POST',
    url: process.env.MEMBER_UPDATED_ENDPOINT,
    schema: {
      body: {
        type: 'object',
        properties: {
          member: {
            type: 'object',
            properties: {
              current: { type: 'object' },
              previous: { type: 'object' }
            },
            required: ['current', 'previous']
          }
        },
        required: ['member']
      }
    },
    handler: async (request, reply) => {
      try {
        const data = request.body
        const free = /free/g
        const paid = /paid|comped/g

        if (!data.member.previous.status) {
          // ignore
        }

        if (data.member.previous.status.match(free) && data.member.current.status.match(paid)) {
          // upgrade, grant role
        }

        if (data.member.previous.status.match(paid) && data.member.current.status.match(free)) {
          // downgrade, revoke role
        }

        const guild = await client.guilds.fetch(process.env.GUILD)
        const channel = guild.channels.cache.get(process.env.WEBHOOK_CHANNEL)

        console.log(data)
        console.log(reply)
      } catch (error) {
        console.error(`Error processing webhook: ${error}`)
        reply.code(500).send({ error: 'An error occured while processing the webhook' })
      }
    }
  }
}
