import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { UserRole } from '@/app/entities/user.ts'
import { prisma } from '@/infra/database/prisma/prisma.ts'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: UserRole
) {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      login: 'john.doe',
      role,
      password: await hash('123456', 8),
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    login: 'john.doe',
    password: '123456',
  })

  const { access_token } = authResponse.body

  return {
    access_token,
    user,
  }
}
