import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Fetch services (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /services', async () => {
    const serviceFactory = new ServiceFactory(prisma)

    await Promise.all([
      serviceFactory.makePrismaService({
        name: 'Teste',
      }),
      serviceFactory.makePrismaService({
        name: 'Tester',
      }),
      serviceFactory.makePrismaService({
        name: 'Teste',
        deletedAt: new Date(),
      }),
      serviceFactory.makePrismaService({
        name: 'Testando',
        deletedAt: new Date(),
      }),
    ])

    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const response = await request(app.server)
      .get('/services?q=teste')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        totalCount: 2,
        services: expect.arrayContaining([
          expect.objectContaining({
            name: 'Teste',
          }),
          expect.objectContaining({
            name: 'Tester',
          }),
        ]),
      })
    )
  })
})
