import { FastifyInstance } from 'fastify'
import { createServiceController } from './controllers/create-service-controller.ts'
import { createUserController } from './controllers/create-user-controller.ts'
import { fetchUsersProfileController } from './controllers/fetch-users-controller.ts'
import { getServiceByIdController } from './controllers/get-service-by-id-controller.ts'
import { getUserProfileController } from './controllers/get-user-profile-controller.ts'
import { verifyJWT } from './middlewares/verify-jwt.ts'

export async function privateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.register(getUserProfileController)
  app.register(createUserController)
  app.register(fetchUsersProfileController)
  app.register(createServiceController)
  app.register(getServiceByIdController)
}
