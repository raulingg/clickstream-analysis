import { getDatabaseConfig, getServerConfig } from './config'
import database from './database'
import SocketServer from './socketServer'

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
const socketServer = SocketServer.init(serverConfig, db)

socketServer.listen(serverConfig.socketPort, () => {
  console.log(`Socket server running at http://localhost:${serverConfig.socketPort}`)
})
