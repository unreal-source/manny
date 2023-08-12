import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import memberAdded from './routes/member-added.js'
import memberUpdated from './routes/member-updated.js'
import memberDeleted from './routes/member-deleted.js'
import logger from '../utilities/logger.js'

const app = fastify({ logger })

const server = {
  configure (client) {
    // Register plugins
    app.register(cors, {
      origin: 'https://primeval-fivus.unrealcommons.org',
      methods: ['POST']
    })
    app.register(helmet)
    app.register(rateLimit)

    // Register routes
    app.register((instance, opts, done) => {
      instance.route(memberAdded(client))
      instance.route(memberUpdated(client))
      instance.route(memberDeleted(client))
      done()
    })
  },
  async start () {
    // Start the server
    try {
      await app.listen({ port: process.env.API_PORT })
      app.log.info(`Server is running on http://localhost:${process.env.API_PORT}`)
    } catch (e) {
      app.log(e)
      process.exit(1)
    }
  }
}

export default server
