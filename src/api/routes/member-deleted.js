import prisma from '../../utilities/prisma-client.js'

export default function (client) {
  return {
    method: 'POST',
    url: process.env.MEMBER_DELETED_ENDPOINT,
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
        const supporter = await prisma.supporter.findFirst({
          where: {
            id: data.member.previous.id,
            ghostName: data.member.previous.name,
            ghostEmail: data.member.previous.email
          }
        })

        if (supporter) {
          if (supporter.discordId) {
            const guild = await client.guilds.fetch(process.env.GUILD)
            const member = await guild.members.fetch(supporter.discordId)
            const hasRole = member.roles.cache.some(role => role.id === process.env.SUPPORTER_ROLE)

            if (member && hasRole) {
              await member.roles.remove(process.env.SUPPORTER_ROLE)
            }
          }

          await prisma.supporter.delete({
            where: { id: data.member.previous.id }
          })

          return reply.code(200).send({ message: 'Paid member removed' })
        }

        return reply.code(400).send({ message: 'Not a paid member' })
      } catch (error) {
        console.error(`Error processing request: ${error}`)
        reply.code(500).send({ error: 'An error occured while processing the request' })
      }
    }
  }
}
