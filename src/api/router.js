import { errorResponse } from './helpers'
import { parse } from 'url'

export default async (req, res, routes, database) => {
  // Find a matching route
  const route = routes.find(route => {
    const methodMatch = route.method === req.method
    let pathMatch = false

    if (typeof route.path === 'object') {
      // Path is a RegEx, we use RegEx matching
      pathMatch = req.url.match(route.path)
    } else {
      // Path is a string, we simply match with URL
      pathMatch = route.path === req.url
    }

    return pathMatch && methodMatch
  })

  // Extract the "id" parameter from route and pass it to controller
  let param = null

  if (route && typeof route.path === 'object') {
    param = req.url.match(route.path)[1]
  }

  // Extract request inputs
  if (route) {
    let inputs = null
    if (req.method === 'POST' || req.method === 'PUT') {
      inputs = await getPostData(req)
    } else {
      inputs = parse(req.url, true).query
    }

    return await route.handler(database, { req, res, param, inputs })
  } else {
    return errorResponse(res, 'Endpoint not found', 404)
  }
}

/**
 * Extract posted data from request inputs
 * @param req
 * @returns {Promise<any>}
 */
function getPostData(req) {
  return new Promise((resolve, reject) => {
    try {
      let inputs = ''
      req.on('data', chunk => {
        inputs += chunk.toString() // convert Buffer to string
      })

      req.on('end', () => {
        //resolve(parse(inputs))
        resolve(inputs)
      })
    } catch (e) {
      reject(e)
    }
  })
}
