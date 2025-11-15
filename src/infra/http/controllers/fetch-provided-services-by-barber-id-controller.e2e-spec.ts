import request from 'supertest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ProvidedServiceFactory } from '@/test/factories/make-provided-service.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { UserFactory } from '@/test/factories/make-user.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Fetch provided services by barber id (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /provided-services', async () => {
    const userFactory = new UserFactory(prisma)

    const client = await userFactory.makePrismaUser({
      role: 'CLIENT',
    })

    const serviceFactory = new ServiceFactory(prisma)

    const service1 = await serviceFactory.makePrismaService({
      name: 'Teste',
    })

    const service2 = await serviceFactory.makePrismaService({
      name: 'Tester',
    })

    const service3 = await serviceFactory.makePrismaService({
      name: 'Testando',
    })

    const { access_token, user } = await createAndAuthenticateUser(
      app,
      'BARBER'
    )

    const providedServiceFactory = new ProvidedServiceFactory(prisma)

    await Promise.all([
      providedServiceFactory.makePrismaProvidedService({
        barberId: new UniqueEntityID(user.id),
        clientId: client.id,
        serviceId: service1.id,
      }),
      providedServiceFactory.makePrismaProvidedService({
        barberId: new UniqueEntityID(user.id),
        clientId: client.id,
        serviceId: service2.id,
      }),
      providedServiceFactory.makePrismaProvidedService({
        barberId: new UniqueEntityID(user.id),
        clientId: client.id,
        serviceId: service3.id,
      }),
    ])

    const response = await request(app.server)
      .get('/provided-services?q=teste')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        totalCount: 2,
        providedServices: expect.arrayContaining([
          expect.objectContaining({
            client: client.name,
            service: 'Teste',
          }),
          expect.objectContaining({
            client: client.name,
            service: 'Tester',
          }),
        ]),
      })
    )
  })
})
