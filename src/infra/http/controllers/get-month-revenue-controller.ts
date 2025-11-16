/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeGetMonthRevenue } from './factories/make-get-month-revenue.ts'

export const getMonthRevenueController: FastifyPluginAsyncZod = async (app) => {
  const getMonthRevenueUseCase = makeGetMonthRevenue()

  app.get(
    '/metrics/month-revenue',
    {
      preHandler: [verifyUserRole(['MANAGER'])],
      schema: {
        tags: ['Métricas para Relatórios'],
        summary:
          'Retorna a receita do mês atual e a diferença quanto ao mês anterior.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z
            .object({
              revenue: z.number(),
              diffFromLastMonth: z.number(),
            })
            .describe('Returns revenue and diff from last month'),
        },
      },
    },
    async (_, reply) => {
      const result = await getMonthRevenueUseCase.execute()

      if (result.isLeft()) {
        throw new Error('getMonthRevenueUseCase returned left')
      }

      const { revenue, diffFromLastMonth } = result.value

      return reply.status(200).send({ revenue, diffFromLastMonth })
    }
  )
}
