/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeDeleteServiceUseCase } from './factories/make-delete-service-use-case.ts'

export const deleteServiceController: FastifyPluginAsyncZod = async (app) => {
  const deleteServiceUseCase = makeDeleteServiceUseCase()

  app.delete(
    '/services/:id',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        tags: ['Gerenciamento de Serviços'],
        summary: 'Inativa (soft delete) um serviço.',
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.null({}).describe('Service deleted succesfully'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Resource not found.'),
        },
      },
    },
    async (request, reply) => {
      const serviceId = request.params.id

      const result = await deleteServiceUseCase.execute({ serviceId })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return reply.status(404).send({
              message: error.message,
            })
          default:
            throw new Error('getServiceByIdUseCase returned left')
        }
      }

      return reply.status(204).send()
    }
  )
}
