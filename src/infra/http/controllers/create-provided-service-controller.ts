/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeCreateProvidedServiceUseCase } from './factories/make-create-provided-service-use-case.ts'
import { ProvidedServicePresenter, ProvidedServicePresenterSchema } from '../presenters/provided-service-presenter.ts'

export const createProvidedServiceController: FastifyPluginAsyncZod = async (app) => {
  const createProvidedServiceUseCase = makeCreateProvidedServiceUseCase()

  app.post(
    '/provided-services',
    {
      preHandler: [verifyUserRole(['MANAGER', 'BARBER'])],
      schema: {
        tags: ['Serviços prestados'],
        summary: 'Registra um serviço prestado.',
        security: [{ bearerAuth: [] }],
        body: z.object({
          clientId: z.uuid(),
          serviceId: z.uuid(),
        }),
        response: {
          201: z
            .object({
              providedService: ProvidedServicePresenterSchema,
            })
            .describe('Provided Service registered!'),
        },
      },
    },
    async (request, reply) => {

      const barberId = request.user.sub

      const { clientId, serviceId } =
        request.body

      const result = await createProvidedServiceUseCase.execute({
        barberId,
        clientId,
        serviceId,
      })

      if (result.isLeft()) {
        throw new Error('createServiceUseCase returned left')
      }

      const { providedService } = result.value

      return reply
        .status(201)
        .send({ providedService: ProvidedServicePresenter.toHTTP(providedService) })
    }
  )
}
