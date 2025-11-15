/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  ProvidedServiceDetailsPresenter,
  ProvidedServiceDetailsPresenterSchema,
} from '../presenters/provided-service-details-presenter.ts'
import { makeFetchProvidedServicesByBarberIdUseCase } from './factories/make-fetch-provided-services-by-barber-id.ts'

export const FetchProvidedServicesByBarberIdController: FastifyPluginAsyncZod =
  async (app) => {
    const fetchProvidedServicesByBarberIdUseCase =
      makeFetchProvidedServicesByBarberIdUseCase()

    app.get(
      '/provided-services',
      {
        preHandler: [verifyUserRole(['MANAGER', 'BARBER'])],
        schema: {
          tags: ['Serviços prestados'],
          summary:
            'Lista e filtra serviços prestados pelo barbeiro autenticado.',
          security: [{ bearerAuth: [] }],
          querystring: z.object({
            q: z
              .string()
              .optional()
              .describe('use to filter by service or client name (contains)'),
            page: z.coerce.number().optional().default(1),
          }),
          response: {
            200: z
              .object({
                providedServices: z.array(
                  ProvidedServiceDetailsPresenterSchema
                ),
                totalCount: z.number(),
              })
              .describe(
                'Returns total count and paginated filtered provided services'
              ),
          },
        },
      },
      async (request, reply) => {
        const barberId = request.user.sub

        const { page, q } = request.query

        const result = await fetchProvidedServicesByBarberIdUseCase.execute({
          barberId,
          page,
          queryParams: {
            q,
          },
        })

        if (result.isLeft()) {
          throw new Error('fetchServicesUseCase returned left')
        }

        const { providedServices, totalCount } = result.value

        return reply.status(200).send({
          providedServices: providedServices.map(
            ProvidedServiceDetailsPresenter.toHTTP
          ),
          totalCount,
        })
      }
    )
  }
