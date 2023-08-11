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
            id: data.member.current.id,
            ghostName: data.member.current.name,
            ghostEmail: data.member.current.email
          }
        })

        if (supporter) {
          const guild = await client.guilds.fetch(process.env.GUILD)
          const member = await guild.fetch(supporter.discordUsername)

          // Revoke supporter role on Discord
          if (member) {
            await member.roles.remove(process.env.PREMIUM_ROLE)
          }

          // Remove supporter profile from database
          await prisma.supporter.delete({
            where: { id: data.member.current.id }
          })

          return reply.code(200).send({ message: 'Paid supporter removed' })
        }
      } catch (error) {
        console.error(`Error processing request: ${error}`)
        reply.code(500).send({ error: 'An error occured while processing the request' })
      }
    }
  }
}
