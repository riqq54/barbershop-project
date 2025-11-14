/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  UserProfilePresenter,
  UserProfilePresenterSchema,
} from '../presenters/user-profile-presenter.ts'
import { makeFetchUsersUseCase } from './factories/make-fetch-users-use-case.ts'

export const fetchUsersController: FastifyPluginAsyncZod = async (app) => {
  const fetchUsersUseCase = makeFetchUsersUseCase()

  app.get(
    '/users',
    {
      preHandler: [verifyUserRole(['MANAGER', 'BARBER'])],
      schema: {
        tags: ['Gerenciamento de Usuários'],
        summary: 'Lista e filtra usuários do sistema.',
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

      const result = await fetchUsersUseCase.execute({
        page,
        queryParams: {
          q,
          role,
        },
      })

      if (result.isLeft()) {
        throw new Error('fetchUsersUseCase returned left')
      }

      const { users, totalCount } = result.value

      const teste = users.map(UserProfilePresenter.toHTTP)

      return reply.status(200).send({ users: teste, totalCount })
    }
  )
}
