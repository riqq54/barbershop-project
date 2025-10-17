import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Get service by ID (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /services/:id', async () => {
    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const serviceFactory = new ServiceFactory(prisma)

    const service = await serviceFactory.makePrismaService({
      name: 'Corte de cabelo',
    })

    const response = await request(app.server)
      .get(`/services/${service.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.service).toEqual(
      expect.objectContaining({
        name: 'Corte de cabelo',
      })
    )
  })
})
