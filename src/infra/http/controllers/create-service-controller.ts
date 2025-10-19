/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  ServicePresenter,
  ServicePresenterSchema,
} from '../presenters/service-presenter.ts'
import { makeCreateServiceUseCase } from './factories/make-create-service-use-case.ts'

export const createServiceController: FastifyPluginAsyncZod = async (app) => {
  const createServiceUseCase = makeCreateServiceUseCase()

  app.post(
    '/services',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        tags: ['Gerenciamento de Serviços'],
        summary: 'Cria um novo serviço no catálogo.',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          valueInCents: z.number(),
          durationInMinutes: z.number(),
        }),
        response: {
          201: z
            .object({
              service: ServicePresenterSchema,
            })
            .describe('Service created!'),
        },
      },
    },
    async (request, reply) => {
      const { name, description, valueInCents, durationInMinutes } =
        request.body

      const result = await createServiceUseCase.execute({
        name,
        description,
        valueInCents,
        durationInMinutes,
      })

      if (result.isLeft()) {
        throw new Error('createServiceUseCase returned left')
      }

      const { service } = result.value

      return reply
        .status(201)
        .send({ service: ServicePresenter.toHTTP(service) })
    }
  )
}
