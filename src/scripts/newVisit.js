import db from '../database'
import { getDatabaseConfig } from '../config'

;(async () => {
  const dbConfig = getDatabaseConfig()
  const database = db.init(dbConfig)
  const conn = await database.getConnection()
  const [visits, columns] = await conn.query(
    `SELECT * FROM visits WHERE visitor_id = ? and ended_at is ?`,
    [1, null]
  )
  
  const isNewVisit = visit => {
    let visitId = visit ? visit.id : null

    if (!visitId) {
      return true
    }

    const currentDate = new Date()
    const createdAt = visit.created_at
    const timeDiff = (currentDate - createdAt) / 1000

    // is new visit if exceeds 1800s (30min)
    return timeDiff > 1800
  }

  const updateVisitEndedAt = async (visitId) => {
    const query = `UPDATE visits SET ended_at = ? where id = ?`
  
    try {
      await conn.query(query, [new Date, visitId])
    } catch (error) {
      throw error
    }
  }

  isNewVisit(visits[0])
  await updateVisitEndedAt(visits[0].id)

  process.exit()
})()
