
import { Server } from './server/server'
import { Logger } from './utils/logger'

const PORT = 8000

const server = new Server()

server
  .open(PORT)
  .then(() => {
    Logger.info(`Listening on http://localhost:${PORT}`)
  })
  .catch((err: string) => {
    Logger.error(`Error: ${err}`)
  })
