import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { ServiceFactory } from '@/test/factories/make-service.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Edit service (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /services/:id', async () => {
    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const serviceFactory = new ServiceFactory(prisma)

    const service = await serviceFactory.makePrismaService({
      name: 'Corte de cabelo',
      description: 'corte de cabelo simples',
      initialValueInCents: 4500,
      durationInMinutes: 30,
    })

    const response = await request(app.server)
      .put(`/services/${service.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: 'Corte de cabelo editado',
        description: 'corte de cabelo simples editado',
        valueInCents: 5500,
        durationInMinutes: 45,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.service).toEqual(
      expect.objectContaining({
        name: 'Corte de cabelo editado',
        description: 'corte de cabelo simples editado',
        valueInCents: 5500,
        durationInMinutes: 45,
      })
    )

    const serviceOnDatabase = await prisma.service.findMany({
      include: {
        servicePrices: true,
      },
    })

    expect(serviceOnDatabase[0].servicePrices).toHaveLength(2)
  })
})
