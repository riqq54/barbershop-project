/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeGetDailyRevenueInPeriodUseCase } from './factories/make-get-daily-revenue-in-period.ts'

export const getDailyRevenueInPeriodController: FastifyPluginAsyncZod = async (
  app
) => {
  const getDailyRevenueInPeriodUseCase = makeGetDailyRevenueInPeriodUseCase()

  app.get(
    '/metrics/daily-revenue-in-period',
    {
      preHandler: [verifyUserRole(['MANAGER'])],
      schema: {
        tags: ['Métricas para Relatórios'],
        summary: 'Retorna a receita diária dos últimos 7 dias.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z
            .array(
              z.object({
                date: z.string(),
                revenue: z.string(),
              })
            )
            .describe('Returns daily revenue from the last 7 days.'),
        },
      },
    },
    async (_, reply) => {
      const result = await getDailyRevenueInPeriodUseCase.execute()

      if (result.isLeft()) {
        throw new Error('getDayProvidedServicesAmountUseCase returned left')
      }

      return reply.status(200).send(result.value)
    }
  )
}
