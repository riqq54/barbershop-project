import { hash } from 'bcryptjs'
import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { UserFactory } from '@/test/factories/make-user.ts'

describe('Authenticate Sessino (E2E)', () => {
  let userFactory: UserFactory

  beforeAll(async () => {
    userFactory = new UserFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await userFactory.makePrismaUser({
      login: 'john.doe',
      password: await hash('123456', 8),
    })

    const response = await request(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({
        login: 'john.doe',
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
