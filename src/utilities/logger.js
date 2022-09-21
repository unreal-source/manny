import pino from 'pino'
const transport = pino.transport({
  target: 'pino-loki',
  options: {
    batching: true,
    interval: 4,
    labels: {
      application: 'Manny'
    },
    host: process.env.LOKI_HOST,
    basicAuth: {
      username: process.env.LOKI_USERNAME,
      password: process.env.LOKI_PASSWORD
    }
  }
})

const log = pino(transport)

export default log
