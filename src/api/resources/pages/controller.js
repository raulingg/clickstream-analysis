import {
  errorResponse,
  successResponse,
  validationErrorResponse
} from '../../helpers'

class PagesController {
  constructor(manager) {
    this.manager = manager
  }

  getStats = async ({ req, res, param: siteId, inputs }) => {
    const { dateInterval } = inputs

    if (!dateInterval) {
      return validationErrorResponse(res, 'dateInterval not supplied')
    }

    try {
      const [rows, fields] = await this.manager.countByDateAndSiteId(
        siteId,
        dateInterval
      )
      return successResponse(res, rows)
    } catch (error) {
      return errorResponse(res, error)
    }
  }
}

export default PagesController
