import { getDatabaseConfig, getServerConfig } from './config'
import database from './database'
import server from './server'

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
const appServer = server.init(serverConfig, db)

appServer.listen(serverConfig.port, () => {
  console.log(`Server running at http://localhost:${serverConfig.port}`)
})
