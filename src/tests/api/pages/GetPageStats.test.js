import server from '../../../api/index'
import request from 'supertest'

afterAll(() => {
  server.close(() => {
    console.log('server closed!')
  })
})

describe(`GET /sites/{id}/pages/stats - get all page stats of a site`, () => {
  test('it should response with status code 200', async () => {
    const response = await request(server).get(
      '/sites/1/pages/stats?dateInterval=1'
    )
    expect(response.status).toBe(200)
  })

  test('it should response with status code 422 when no date interval is supplied', async () => {
    const response = await request(server).get(
      '/sites/1/pages/stats'
    )
    expect(response.status).toBe(422)
  })

  test('it should response with status code 422 when a non-numeric date interval is supplied', async () => {
    const response = await request(server).get(
      '/sites/1/pages/stats?dateInterval=sjsj'
    )
    expect(response.status).toBe(422)
  })
})


