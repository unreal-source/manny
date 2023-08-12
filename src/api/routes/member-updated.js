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
          return reply.code(400).send({ error: 'Membership status unchanged' })
        }

        if (data.member.previous.status.match(free) && data.member.current.status.match(paid)) {
          await prisma.supporter.create({
            data: {
              id: data.member.current.id,
              ghostName: data.member.current.name,
              ghostEmail: data.member.current.email
            }
          })

          reply.code(200).send({ message: 'New paid member added' })
        }

        if (data.member.previous.status.match(paid) && data.member.current.status.match(free)) {
          const supporter = await prisma.supporter.findFirst({
            where: {
              id: data.member.current.id,
              ghostName: data.member.current.name,
              ghostEmail: data.member.current.email
            }
          })

          if (supporter) {
            // Revoke supporter role on Discord
            if (supporter.discordId) {
              const guild = await client.guilds.fetch(process.env.GUILD)
              const member = await guild.members.fetch(supporter.discordId)
              const hasRole = member.roles.cache.some(role => role.id === process.env.SUPPORTER_ROLE)

              if (member && hasRole) {
                await member.roles.remove(process.env.SUPPORTER_ROLE)
              }
            }

            // Remove supporter profile from database
            await prisma.supporter.delete({
              where: { id: data.member.current.id }
            })

            return reply.code(200).send({ message: 'Paid supporter removed' })
          }
        }
      } catch (error) {
        console.error(`Error processing request: ${error}`)
        reply.code(500).send({ error: 'An error occured while processing the request' })
      }
    }
  }
}
