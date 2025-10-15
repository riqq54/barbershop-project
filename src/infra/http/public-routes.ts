import type { FastifyInstance } from 'fastify'
import { authenticateController } from './controllers/authenticate-controller.ts'
import { healthCheckController } from './controllers/health-check.ts'
import { registerClientController } from './controllers/register-client-controller.ts'

export async function publicRoutes(app: FastifyInstance) {
  app.register(registerClientController)
  app.register(authenticateController)

  app.register(healthCheckController)
}
