import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { UserFactory } from '@/test/factories/make-user.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Fetch Available Appointment Times (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /appointments/available-times', async () => {
    const serviceFactory = new ServiceFactory(prisma)
    const userFactory = new UserFactory(prisma)

    const service = await serviceFactory.makePrismaService({
      name: 'service1',
      durationInMinutes: 30,
    })

    const barber = await userFactory.makePrismaUser({
      role: 'BARBER',
    })

    const date = new Date(2025, 10, 28, 13, 0, 0)

    const { access_token } = await createAndAuthenticateUser(app, 'CLIENT')

    await request(app.server)
      .post('/appointments')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        barberId: barber.id.toString(),
        serviceId: service.id.toString(),
        startsAt: new Date(2025, 10, 28, 13, 0, 0).toString(),
      })

    const response = await request(app.server)
      .get(
        `/appointments/available-times?serviceId=${service.id.toString()}&barberId=${barber.id.toString()}&date=${date.toString()}`
      )
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        availableTimes: expect.not.arrayContaining(['12:40']),
      })
    )
  })
})
