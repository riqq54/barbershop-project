import type { FastifyInstance } from 'fastify'
import { healthCheckController } from './controllers/health-check.ts'
import { registerUserController } from './controllers/register-user-controller.ts'

export async function publicRoutes(app: FastifyInstance) {
  app.register(registerUserController)
  app.register(healthCheckController)
}
