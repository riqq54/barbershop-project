import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { UserFactory } from '@/test/factories/make-user.ts'

describe('Create provided service (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /provided-services', async () => {

    const userFactory = new UserFactory(prisma)

    const client = await userFactory.makePrismaUser({
        role: 'CLIENT',
      })

    const serviceFactory = new ServiceFactory(prisma)
    
    const service = await serviceFactory.makePrismaService({
      initialValueInCents: 4500
    })

    const { access_token } = await createAndAuthenticateUser(app, 'BARBER')

    const response = await request(app.server)
      .post('/provided-services')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        clientId: client.id.toString(),
        serviceId: service.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const providedServiceOnDatabase = await prisma.providedService.findFirst({
      where: {
        id: response.body.providedService.id,
      },
    })

    expect(providedServiceOnDatabase).toBeTruthy()
  })
})
