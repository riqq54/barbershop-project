import request from 'supertest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ProvidedServiceFactory } from '@/test/factories/make-provided-service.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { UserFactory } from '@/test/factories/make-user.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Get popular services (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /metrics/popular-services', async () => {
    const userFactory = new UserFactory(prisma)

    const client = await userFactory.makePrismaUser({
      role: 'CLIENT',
    })

    const serviceFactory = new ServiceFactory(prisma)

    const service1 = await serviceFactory.makePrismaService({
      name: 'Teste',
      initialValueInCents: 4500,
    })
    const service2 = await serviceFactory.makePrismaService({
      name: 'Tester',
      initialValueInCents: 5500,
    })

    const { access_token, user } = await createAndAuthenticateUser(
      app,
      'MANAGER'
    )

    const providedServiceFactory = new ProvidedServiceFactory(prisma)

    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(today.getDate() - 1)

    for (let i = 0; i < 10; i++) {
      await providedServiceFactory.makePrismaProvidedService({
        barberId: new UniqueEntityID(user.id),
        clientId: client.id,
        serviceId: service1.id,
        valueInCents: service1.currentValueInCents,
        createdAt: yesterday,
      })
    }

    for (let i = 0; i < 15; i++) {
      await providedServiceFactory.makePrismaProvidedService({
        barberId: new UniqueEntityID(user.id),
        clientId: client.id,
        serviceId: service2.id,
        valueInCents: service2.currentValueInCents,
        createdAt: today,
      })
    }

    const response = await request(app.server)
      .get('/metrics/popular-services')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amount: 15,
          service: 'Tester',
        }),
        expect.objectContaining({
          amount: 10,
          service: 'Teste',
        }),
      ])
    )
  })
})
