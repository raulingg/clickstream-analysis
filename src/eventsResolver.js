import BaseRepository from './data/BaseRepository'
import { format as SqlStringFormat } from 'sqlstring'

const EVENTS = {
  PAGE_VISITED: 'pageVisited',
  LINK_CLICKED: 'linkClicked'
}

export default async (eventMessage, database) => {
  switch (eventMessage.event) {
    case EVENTS.PAGE_VISITED:
      const conn = await database.getConnection()
      BaseRepository.getInstance().setConnection(conn)
      await pageVisitedResolver(eventMessage)
      return
    case EVENTS.LINK_CLICKED:
      return
  }
}

const pageVisitedResolver = async ({ visitorIdentity, clientId, data }) => {
  const repository = BaseRepository.getInstance()
  const conn = repository.getConnection()

  try {
    await conn.query('START TRANSACTION')

    const sites = await repository.findByField('sites', 'client_id', clientId)
    const visitorPromise = repository.findByField(
      'visitors',
      'identity',
      visitorIdentity
    )
    const pagePromise = repository.findByFields(
      'pages',
      ['url', 'site_id'],
      [data.pathname, sites[0].id]
    )
    const visitors = await visitorPromise
    const pages = await pagePromise
    let visitorId = visitors[0] ? visitors[0].id : null
    let pageId = pages[0] ? pages[0].id : null

    if (!pageId) {
      pageId = await repository.create(
        'pages',
        ['url', 'site_id'],
        [data.pathname, sites[0].id]
      )
    }

    if (!visitorId) {
      visitorId = await repository.create(
        'visitors',
        ['identity', 'site_id'],
        [visitorIdentity, sites[0].id]
      )
    }

    const [visits, columns] = await conn.query(
      `SELECT id, created_at FROM visits WHERE visitor_id = ? and ended_at is ?`,
      [visitorId, null]
    )

    let visitId = visits[0] ? visits[0].id : null

    if (!visitId) {
      visitId = await repository.create(
        'visits',
        ['visitor_id', 'site'],
        [visitorId, sites[0].name]
      )
    } else if (exceedsDurationTime(visits[0].created_at)) {
      const visitCreatePromise = repository.create(
        'visits',
        ['visitor_id', 'site'],
        [visitorId, sites[0].name]
      )
      const visitUpdatePromise = repository.update(
        'visits',
        visits[0].id,
        ['ended_at'],
        [new Date()]
      )

      visitId = await visitCreatePromise
      await visitUpdatePromise
    }

    const pageViewId = await repository.create(
      'pageviews',
      ['visit_id', 'page_id', 'page_url', 'site'],
      [visitId, pageId, data.pathname, sites[0].name]
    )

    await conn.query('COMMIT')
    await conn.release()
  } catch (err) {
    if (conn != null) {
      await conn.query('ROLLBACK')
    }

    throw err
  }
}

const exceedsDurationTime = createdAt => {
  const currentDate = new Date()
  const timeDiff = (currentDate - createdAt) / 1000

  // is new visit if exceeds 1800s (30min)
  return timeDiff > 1800
}
