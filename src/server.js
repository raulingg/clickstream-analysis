import { createServer } from 'http'
import io from 'socket.io'
import BaseRepository from './data/BaseRepository'
import eventsResolver from './eventsResolver'

export default {
  init: (configs, database) => {
    const httpServer = createServer()
    const socketServer = io(httpServer)

    // AUTHORIZATION MIDDLEWARE
    socketServer.use(async (socket, next) => {
      console.log('Run authorization middleware')
      const {
        _query: { token: clientId },
        headers: { host }
      } = socket.request
      const domain = host.split(':').shift()

      if (!clientId) {
        console.log('Client Id not supplied')
        next(new Error('Client Id not supplied'))
      }

      let site

      try {
        const conn = await database.getConnection()
        const repository = BaseRepository.getInstance().setConnection(conn)
        const results = await repository.findByField(
          'sites',
          'client_id',
          clientId
        )
        const release = await conn.release()
        site = results[0]
      } catch (error) {
        console.log(error)
        next(new Error(`Site with client id: ${clientId} not exists`))
      }

      if (site.domain !== domain) {
        next(new Error('Forbidden'))
      }

      next()
    })

    socketServer.on('connection', socket => {
      socket.on('message', async message => {
        console.log('Socket received message with:', message)
        const { token: clientId } = socket.request._query

        try {
          await eventsResolver(database, { ...message, clientId })
        } catch (error) {
          console.log(error)
          throw error
        }
      })

      socket.on('disconnect', socket => {
        console.log('socket  disconnected')
      })
    })

    return httpServer
  }
}
