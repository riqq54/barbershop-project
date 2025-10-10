import type { FastifyInstance } from 'fastify'
import { authenticateController } from './controllers/authenticate-controller.ts'
import { healthCheckController } from './controllers/health-check.ts'
import { registerUserController } from './controllers/register-user-controller.ts'

export async function publicRoutes(app: FastifyInstance) {
  app.register(registerUserController)
  app.register(authenticateController)

  app.register(healthCheckController)
}
