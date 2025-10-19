/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { UserAlreadyExistsError } from '@/app/use-cases/errors/user-already-exists-error.ts'
import { verifyUserRole } from '../middlewares/verify-user-role.ts'
import {
  UserProfilePresenter,
  UserProfilePresenterSchema,
} from '../presenters/user-profile-presenter.ts'
import { makeCreateUserUseCase } from './factories/make-create-user-use-case.ts'

export const createUserController: FastifyPluginAsyncZod = async (app) => {
  const createUserUseCase = makeCreateUserUseCase()

  app.post(
    '/users',
    {
      preHandler: [verifyUserRole('MANAGER')],
      schema: {
        tags: ['Gerenciamento de Usuários'],
        summary: 'Cria um novo usuário (MANAGER, BARBER, CLIENT).',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          login: z.string(),
          role: z.enum(['CLIENT', 'BARBER', 'MANAGER']),
          password: z.string(),
        }),
        response: {
          201: z
            .object({
              user: UserProfilePresenterSchema,
            })
            .describe('User created!'),
          409: z
            .object({
              message: z.string(),
            })
            .describe('User already exists.'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Bad Request'),
        },
      },
    },
    async (request, reply) => {
      const { name, login, role, password } = request.body

      const result = await createUserUseCase.execute({
        name,
        login,
        role,
        password,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case UserAlreadyExistsError:
            return reply.status(409).send({
              message: error.message,
            })
          default:
            return reply.status(404).send({
              message: error.message,
            })
        }
      }

      const { user } = result.value

      return reply.status(201).send({ user: UserProfilePresenter.toHTTP(user) })
    }
  )
}
