import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Create service (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /services', async () => {
    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const response = await request(app.server)
      .post('/services')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: 'Corte',
        description: 'Corte de cabelo comum',
        valueInCents: 4500,
        durationInMinutes: 30,
      })

    expect(response.statusCode).toBe(201)

    const serviceOnDatabase = await prisma.service.findFirst({
      where: {
        name: 'Corte',
      },
    })

    expect(serviceOnDatabase).toBeTruthy()
  })
})
