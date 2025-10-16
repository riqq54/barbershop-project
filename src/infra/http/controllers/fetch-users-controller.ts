/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  UserProfilePresenter,
  UserProfilePresenterSchema,
} from '../presenters/user-profile-presenter.ts'
import { makeFetchUsersUseCase } from './factories/make-fetch-users.ts'

export const fetchUsersProfileController: FastifyPluginAsyncZod = async (
  app
) => {
  const fetchUsersProfileUseCase = makeFetchUsersUseCase()

  app.get(
    '/users',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          q: z
            .string()
            .optional()
            .describe('use to filter by login or name (contains)'),
          role: z.enum(['MANAGER', 'BARBER', 'CLIENT']).optional(),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z
            .object({
              users: z.array(UserProfilePresenterSchema),
              totalCount: z.number(),
            })
            .describe('Returns total count and paginated filtered users'),
        },
      },
    },
    async (request, reply) => {
      const { page, q, role } = request.query

      const result = await fetchUsersProfileUseCase.execute({
        page,
        queryParams: {
          q,
          role,
        },
      })

      if (result.isLeft()) {
        return reply.status(200).send({ users: [], totalCount: 0 })
      }

      const { users, totalCount } = result.value

      const teste = users.map(UserProfilePresenter.toHTTP)

      return reply.status(200).send({ users: teste, totalCount })
    }
  )
}
