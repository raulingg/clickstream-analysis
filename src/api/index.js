import { createServer } from 'http'
import router from './router'
import routes from './routes'
import { getDatabaseConfig, getServerConfig } from '../config'
import database from '../database'


// Catch unhandling unexpected exceptions
process.on('uncaughtException', error => {
  console.error(`uncaughtException ${error.message}`)
})

// Catch unhandling rejected promises
process.on('unhandledRejection', reason => {
  console.error(`unhandledRejection ${reason}`)
})

const dbConfig = getDatabaseConfig()
const db = database.init(dbConfig)

const serverConfig = getServerConfig()

const server = createServer(async (req, res) => {
  await router(req, res, routes, db)
})

server.listen(serverConfig.apiPort, () => {
  console.log(`API Server listening on port ${serverConfig.apiPort}`)
})
