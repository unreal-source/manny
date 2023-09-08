import pino from 'pino'
const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname'
  }
})

const log = pino(transport)

export default log
