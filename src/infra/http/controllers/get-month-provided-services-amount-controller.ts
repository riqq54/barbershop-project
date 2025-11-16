/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeGetMonthProvidedServicesAmountUseCase } from './factories/make-get-month-provided-services-amount.ts'

export const getMonthProvidedServicesAmountController: FastifyPluginAsyncZod =
  async (app) => {
    const getMonthProvidedServicesAmountUseCase =
      makeGetMonthProvidedServicesAmountUseCase()

    app.get(
      '/metrics/month-provided-services-amount',
      {
        preHandler: [verifyUserRole(['MANAGER'])],
        schema: {
          tags: ['Métricas para Relatórios'],
          summary:
            'Retorna a quantidade de serviços prestados e a diferença quanto ao mês anterior.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z
              .object({
                amount: z.number(),
                diffFromLastMonth: z.number(),
              })
              .describe(
                'Returns provided services amount on current month and diff from last month'
              ),
          },
        },
      },
      async (_, reply) => {
        const result = await getMonthProvidedServicesAmountUseCase.execute()

        if (result.isLeft()) {
          throw new Error('getMonthProvidedServicesAmountUseCase returned left')
        }

        const { amount, diffFromLastMonth } = result.value

        return reply.status(200).send({ amount, diffFromLastMonth })
      }
    )
  }
