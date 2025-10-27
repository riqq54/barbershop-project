import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'
import { UserFactory } from '@/test/factories/make-user.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'

describe('Create appointment (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /appointments', async () => {
    
    const userFactory = new UserFactory(prisma)

    const barber = await userFactory.makePrismaUser({
        role: 'BARBER',
      })

    const serviceFactory = new ServiceFactory(prisma)
    
    const service = await serviceFactory.makePrismaService({
      durationInMinutes: 60
    })

    const { access_token } = await createAndAuthenticateUser(app, 'CLIENT')

    const response = await request(app.server)
      .post('/appointments')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        barberId: barber.id.toString(),
        serviceId: service.id.toString(),
        startsAt: new Date(2025, 10, 28, 13, 0, 0).toString(),
      })

    expect(response.statusCode).toBe(201)

    const appointmentOnDatabase = await prisma.appointment.findFirst({
      where: {
        startsAt: new Date(2025, 10, 28, 13, 0, 0)
      },
    })

    expect(appointmentOnDatabase).toBeTruthy()
  })
})
