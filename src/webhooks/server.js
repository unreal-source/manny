import fastify from 'fastify'
// import fetch from 'node-fetch'
import memberCreated from './routes/member-created.js'
import memberUpdated from './routes/member-updated.js'
import memberRemoved from './routes/member-removed.js'

const app = fastify({ logger: true })

const server = {
  configure (client) {
    // Register plugins
    // Register routes
    app.register((instance, opts, done) => {
      instance.route(memberCreated(client))
      instance.route(memberUpdated(client))
      instance.route(memberRemoved(client))
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
