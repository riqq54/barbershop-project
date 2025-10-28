/** biome-ignore-all lint/suspicious/useAwait: fastify plugin */
import { FastifyInstance } from 'fastify'
import { createAppointmentController } from './controllers/create-appointment-controller.ts'
import { createServiceController } from './controllers/create-service-controller.ts'
import { createUserController } from './controllers/create-user-controller.ts'
import { deleteServiceController } from './controllers/delete-service-controller.ts'
import { editServiceController } from './controllers/edit-service-controller.ts'
import { fetchAvailableAppointmentTimesController } from './controllers/fetch-available-appointment-times-controller.ts'
import { fetchServicesController } from './controllers/fetch-services-controller.ts'
import { fetchUsersController } from './controllers/fetch-users-controller.ts'
import { getServiceByIdController } from './controllers/get-service-by-id-controller.ts'
import { getUserProfileController } from './controllers/get-user-profile-controller.ts'
import { verifyJWT } from './middlewares/verify-jwt.ts'

export async function privateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.register(getUserProfileController)
  app.register(createUserController)
  app.register(fetchUsersController)
  app.register(createServiceController)
  app.register(getServiceByIdController)
  app.register(fetchServicesController)
  app.register(deleteServiceController)
  app.register(editServiceController)
  app.register(createAppointmentController)
  app.register(fetchAvailableAppointmentTimesController)
}
