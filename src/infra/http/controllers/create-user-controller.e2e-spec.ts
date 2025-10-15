import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Create user (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /users', async () => {
    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: 'Test User',
        login: 'test.user',
        role: 'BARBER',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        login: 'test.user',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
