import { JsonResponse } from '../../helpers'
class PagesController {

  constructor(manager) {
    this.manager = manager
  }

  getStats = async ({ req, res, param: siteId, inputs }) => {
    const { dateInterval } = inputs

    if (!dateInterval) {
      const errorMessages = {
        dateInterval : ['dateInterval is required']
      }
      return JsonResponse.validationError(res, errorMessages)
    }

    if (isNaN(dateInterval)) {
      const errorMessages = {
        dateInterval : ['dateInterval should be a number']
      }
      return JsonResponse.validationError(res, errorMessages)
    }

    try {
      const [rows, fields] = await this.manager.countByDateAndSiteId(
        siteId,
        dateInterval
      )
      return JsonResponse.success(res, rows)
    } catch (error) {
      return JsonResponse.error(res, error)
    }
  }
}

export default PagesController
