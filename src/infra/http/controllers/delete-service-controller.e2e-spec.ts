import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Delete service (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /services/:id', async () => {
    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const serviceFactory = new ServiceFactory(prisma)

    const service = await serviceFactory.makePrismaService({
      name: 'Corte de cabelo',
    })

    const response = await request(app.server)
      .delete(`/services/${service.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const serviceOnDatabase = await prisma.service.findMany()

    expect(serviceOnDatabase[0].deletedAt).toBeDefined()
  })
})
