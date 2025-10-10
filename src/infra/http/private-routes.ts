import { FastifyInstance } from 'fastify'
import { getUserProfileController } from './controllers/get-user-profile-controller.ts'
import { verifyJWT } from './middlewares/verify-jwt.ts'

export async function privateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.register(getUserProfileController)
}
