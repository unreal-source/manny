import pino from 'pino'

const localConfig = {
  target: 'pino-pretty',
  options: {
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname'
  }
}

const axiomConfig = {
  target: '@axiomhq/pino',
  options: {
    dataset: process.env.AXIOM_DATASET,
    token: process.env.AXIOM_TOKEN
  }
}

const localTransport = pino.transport(localConfig)
const axiomTransport = pino.transport(axiomConfig)

const log = process.env.AXIOM_TOKEN ? pino(axiomTransport) : pino(localTransport)
const fastifyOptions = process.env.AXIOM_TOKEN ? { transport: axiomConfig } : { transport: localConfig }

export { log, fastifyOptions }
