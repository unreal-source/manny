import pino from 'pino'
const localTransport = pino.transport({
  target: 'pino-pretty',
  options: {
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname'
  }
})

const axiomTransport = pino.transport({
  target: '@axiomhq/pino',
  options: {
    dataset: process.env.AXIOM_DATASET,
    token: process.env.AXIOM_TOKEN
  }
})

const log = process.env.AXIOM_TOKEN ? pino(axiomTransport) : pino(localTransport)

export default log
