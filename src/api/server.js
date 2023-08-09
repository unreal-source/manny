import fastify from 'fastify'
// import fetch from 'node-fetch'
import memberAdded from './routes/member-added.js'
import memberUpdated from './routes/member-updated.js'
import memberDeleted from './routes/member-deleted.js'

const app = fastify({ logger: true })

const server = {
  configure (client) {
    // Register plugins
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
      await app.listen({ port: process.env.WEBHOOK_PORT })
      console.log(`Server is running on http://localhost:${process.env.WEBHOOK_PORT}`)
    } catch (e) {
      app.log(e)
      process.exit(1)
    }
  }
}

export default server
