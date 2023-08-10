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

        if (data.member.current.status !== 'paid') {
          return reply.code(400).send({ error: 'Not a paid member' })
        }

        await prisma.supporter.create({
          data: {
            id: data.member.current.id,
            ghostName: data.member.current.name,
            ghostEmail: data.member.current.email,
            discordUsername: null
          }
        })

        reply.code(200).send({ message: 'New paid member added' })

        const guild = await client.guilds.fetch(process.env.GUILD)
        const channel = guild.channels.cache.get(process.env.WEBHOOK_CHANNEL)

        channel.send({ content: `Member created: ${data.member.current.name}, Status: ${data.member.current.status}` })
      } catch (error) {
        console.error(`Error processing request: ${error}`)
        reply.code(500).send({ error: 'An error occured while processing the request' })
      }
    }
  }
}
