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
      schema: {
        // tags: ['auth'],
        preHandler: [verifyUserRole('MANAGER')],
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          name: z.string().optional(),
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
      const { page, name, role } = request.query

      const result = await fetchUsersProfileUseCase.execute({
        page,
        queryParams: {
          q: name,
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
