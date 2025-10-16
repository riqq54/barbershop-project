import request from 'supertest'
import { app } from '@/infra/app.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'
import { UserFactory } from '@/test/factories/make-user.ts'
import { createAndAuthenticateUser } from '@/test/utils/create-and-authenticate-user.ts'

describe('Fetch users (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /users', async () => {
    const userFactory = new UserFactory(prisma)

    await Promise.all([
      userFactory.makePrismaUser({
        name: 'Teste',
        role: 'BARBER',
      }),
      userFactory.makePrismaUser({
        name: 'Tester',
        role: 'CLIENT',
      }),
      userFactory.makePrismaUser({
        name: 'Teste2',
        role: 'CLIENT',
      }),
    ])

    const { access_token } = await createAndAuthenticateUser(app, 'MANAGER')

    const response = await request(app.server)
      .get('/users?role=CLIENT&q=tester')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        totalCount: 1,
        users: expect.arrayContaining([
          expect.objectContaining({
            name: 'Tester',
            role: 'CLIENT',
          }),
        ]),
      })
    )
  })
})
