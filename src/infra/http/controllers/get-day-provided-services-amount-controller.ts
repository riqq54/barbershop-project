/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import { makeGetDayProvidedServicesAmountUseCase } from './factories/make-get-day-provided-services-amount.ts'

export const getDayProvidedServicesAmountController: FastifyPluginAsyncZod =
  async (app) => {
    const getDayProvidedServicesAmountUseCase =
      makeGetDayProvidedServicesAmountUseCase()

    app.get(
      '/metrics/day-provided-services-amount',
      {
        preHandler: [verifyUserRole(['MANAGER'])],
        schema: {
          tags: ['Métricas para Relatórios'],
          summary:
            'Retorna a quantidade de serviços prestados hoje e a diferença quanto a ontem.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z
              .object({
                amount: z.number(),
                diffFromYesterday: z.number(),
              })
              .describe(
                'Returns provided services amount for today and diff from yesterday'
              ),
          },
        },
      },
      async (_, reply) => {
        const result = await getDayProvidedServicesAmountUseCase.execute()

        if (result.isLeft()) {
          throw new Error('getDayProvidedServicesAmountUseCase returned left')
        }

        const { amount, diffFromYesterday } = result.value

        return reply.status(200).send({ amount, diffFromYesterday })
      }
    )
  }
