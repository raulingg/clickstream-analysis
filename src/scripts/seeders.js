import db from '../database'
import { getDatabaseConfig } from '../config'
import bcrypt from 'bcrypt/bcrypt'
import FakerName from 'faker/lib/name'
import FakerInternet from 'faker/lib/internet'
import FakerRandom from 'faker/lib/random'


const dbConfig = getDatabaseConfig()
const database = db.init(dbConfig)

const createUser = async (data = {}) => {
  const conn = await database.getConnection()
  const query = `INSERT INTO users (name, lastname, email, password, secret) VALUES (?, ?, ?, ?, ?)`

  const values = await getUserData(data)

  const [result] = await conn.query(query, values)
  return result.insertId
}

const getUserData = async ({ name, lastname, email, password = '123456' }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return [
    name || FakerName.firstName(),
    lastname || FakerName.lastName(),
    email || FakerInternet.email(),
    passwordHash,
    FakerRandom.uuid()
  ]
}

const createSite = async (data = {}) => {
  const conn = await database.getConnection()
  const query = `INSERT INTO sites (name, domain, client_id, owner_id) VALUES (?, ?, ?, ?)`

  const values = await getSiteData(data)
  const [result] = await conn.query(query, values)

  return result.insertId
}

const getSiteData = async ({ name, domain, clientId, ownerId }) => [
  name || FakerInternet.domainWord(),
  domain || FakerInternet.domainName(),
  clientId || FakerRandom.alphaNumeric(16),
  ownerId
]
;(async () => {
  const userId = await createUser({
    email: 'raul@myemail.com',
    password: '123456'
  })
  await createSite({
    ownerId: userId,
    name: 'My clickstream site',
    domain: 'localhost',
    clientId: '123456789'
  })
  process.exit()
})()
