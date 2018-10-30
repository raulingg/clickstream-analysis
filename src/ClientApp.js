import express from 'express'
import path from 'path'

/**
 * Note:  Express is used only with purpose of creating a client app, 
 *        this doesn't use for building the server app
 */
const app = express()
const pathFile = path.join(__dirname, '../public')

app.use(express.static(pathFile))
app.set('port', 3000)
app.get('/', (req, res) => res.sendFile(pathFile + '/index.html'))

app.get('/about', (req, res) => res.sendFile(pathFile + '/about.html'))

app.get('/charge', (req, res) => res.sendFile(pathFile + '/charge.html'))

app.get('/contact', (req, res) => res.sendFile(pathFile + '/contact.html'))

app.listen(app.get('port'), () =>
  console.log('Express server listening on http://localhost:' + app.get('port'))
)
