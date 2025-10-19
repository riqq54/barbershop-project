/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  ServicePresenter,
  ServicePresenterSchema,
} from '../presenters/service-presenter.ts'
import { makeEditServiceUseCase } from './factories/make-edit-service-use-case.ts'

export const editServiceController: FastifyPluginAsyncZod = async (app) => {
  const editServiceUseCase = makeEditServiceUseCase()

  app.put(
    '/services/:id',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        tags: ['Gerenciamento de Serviços'],
        summary: 'Edita os dados de serviço existente.',
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          valueInCents: z.number(),
          durationInMinutes: z.number(),
        }),
        response: {
          200: z
            .object({
              service: ServicePresenterSchema,
            })
            .describe('Service edited!'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Resource not found.'),
        },
      },
    },
    async (request, reply) => {
      const { name, description, valueInCents, durationInMinutes } =
        request.body

      const serviceId = request.params.id

      const result = await editServiceUseCase.execute({
        serviceId,
        name,
        description,
        valueInCents,
        durationInMinutes,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return reply.status(404).send({
              message: error.message,
            })
          default:
            throw new Error('editServiceUseCase returned left')
        }
      }

      const { service } = result.value

      return reply
        .status(200)
        .send({ service: ServicePresenter.toHTTP(service) })
    }
  )
}
