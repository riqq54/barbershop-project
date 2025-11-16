/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeGetPopularServicesUseCase } from './factories/make-get-popular-services-use-case.ts'

export const getPopularServicesController: FastifyPluginAsyncZod = async (
  app
) => {
  const getPopularServicesUseCase = makeGetPopularServicesUseCase()

  app.get(
    '/metrics/popular-services',
    {
      preHandler: [verifyUserRole(['MANAGER'])],
      schema: {
        tags: ['Métricas para Relatórios'],
        summary:
          'Retorna os serviços populares e a quantidade de vezes que foram prestados.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z
            .array(
              z.object({
                service: z.string(),
                amount: z.number(),
              })
            )
            .describe('Returns popular services'),
        },
      },
    },
    async (_, reply) => {
      const result = await getPopularServicesUseCase.execute()

      if (result.isLeft()) {
        throw new Error('getMonthProvidedServicesAmountUseCase returned left')
      }

      return reply.status(200).send(result.value)
    }
  )
}
