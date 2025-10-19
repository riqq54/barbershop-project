/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  ServicePresenter,
  ServicePresenterSchema,
} from '../presenters/service-presenter.ts'
import { makeGetServiceByIdUseCase } from './factories/make-get-service-by-id-use-case.ts'

export const getServiceByIdController: FastifyPluginAsyncZod = async (app) => {
  const getServiceByIdUseCase = makeGetServiceByIdUseCase()

  app.get(
    '/services/:id',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        tags: ['Gerenciamento de Serviços'],
        summary: 'Busca um serviço específico por ID.',
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z
            .object({
              service: ServicePresenterSchema,
            })
            .describe('Returns service'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Resource not found.'),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Bad Request.'),
        },
      },
    },
    async (request, reply) => {
      const serviceId = request.params.id

      const result = await getServiceByIdUseCase.execute({ serviceId })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return reply.status(404).send({
              message: error.message,
            })
          default:
            return reply.status(400).send({
              message: error.message,
            })
        }
      }

      const { service } = result.value

      return reply
        .status(200)
        .send({ service: ServicePresenter.toHTTP(service) })
    }
  )
}
