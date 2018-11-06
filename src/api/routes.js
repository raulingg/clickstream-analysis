/**
 * We define all our routes in this file. Routes are matched using `path`.
 * 1. If "path" is a string, then we simply match with url
 * 2. If "path is a object, then we assume it is a RegEx and use RegEx matching
 */

import { PagesController, PagesManager } from './resources/pages'

const makePagesController = database => {
  const pagesManager = new PagesManager(database)
  return new PagesController(pagesManager)
}

const routes = [
  {
    method: 'GET',
    path: /\/sites\/([0-9a-z]+)\/pages\/stats/,
    handler: async (database, serverParams) => {
      const controller = makePagesController(database)
      return await controller.getStats({ ...serverParams })
    }
  }
]

export default routes
