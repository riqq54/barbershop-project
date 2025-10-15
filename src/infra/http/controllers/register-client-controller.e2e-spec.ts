import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'

describe('Register as a user (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.server).post('/accounts').send({
      name: 'John Doe',
      login: 'john.doe',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        login: 'john.doe',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
