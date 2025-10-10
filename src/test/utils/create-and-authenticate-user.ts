import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/accounts').send({
    name: 'John Doe',
    login: 'john.doe',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    login: 'john.doe',
    password: '123456',
  })

  const { access_token } = authResponse.body

  return {
    access_token,
  }
}
