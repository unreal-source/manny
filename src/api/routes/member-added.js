import prisma from '../../utilities/prisma-client.js'

export default function (client) {
  return {
    method: 'POST',
    url: process.env.MEMBER_ADDED_ENDPOINT,
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
        const guild = await client.guilds.fetch(process.env.GUILD)
        const channel = guild.channels.cache.get(process.env.WEBHOOK_CHANNEL)

        channel.send({ content: `Member created: ${data.member.current.name}, Status: ${data.member.current.status}` })
      } catch (error) {
        console.error(`Error processing webhook: ${error}`)
        reply.code(500).send({ error: 'An error occured while processing the webhook' })
      }
    }
  }
}
