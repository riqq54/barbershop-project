/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  ServicePresenter,
  ServicePresenterSchema,
} from '../presenters/service-presenter.ts'
import { makeFetchServicesUseCase } from './factories/make-fetch-services-use-case.ts'

export const fetchServicesController: FastifyPluginAsyncZod = async (app) => {
  const fetchServicesUseCase = makeFetchServicesUseCase()

  app.get(
    '/services',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          q: z
            .string()
            .optional()
            .describe('use to filter by service name (contains)'),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z
            .object({
              services: z.array(ServicePresenterSchema),
              totalCount: z.number(),
            })
            .describe('Returns total count and paginated filtered services'),
        },
      },
    },
    async (request, reply) => {
      const { page, q } = request.query

      const result = await fetchServicesUseCase.execute({
        page,
        queryParams: {
          q,
        },
      })

      if (result.isLeft()) {
        throw new Error('fetchServicesUseCase returned left')
      }

      const { services, totalCount } = result.value

      return reply
        .status(200)
        .send({ services: services.map(ServicePresenter.toHTTP), totalCount })
    }
  )
}
