/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { UserAlreadyExistsError } from '@/app/use-cases/errors/user-already-exists-error.ts'
import { makeRegisterUserUseCase } from './factories/make-register-user-use-case.ts'

export const registerUserController: FastifyPluginAsyncZod = async (app) => {
  const registerUserUseCase = makeRegisterUserUseCase()

  app.post(
    '/accounts',
    {
      schema: {
        // tags: ['auth'],
        body: z.object({
          name: z.string(),
          login: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.null().describe('Account created!'),
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
      const { name, login, password } = request.body

      const result = await registerUserUseCase.execute({
        name,
        login,
        role: 'CLIENT',
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

      return reply.status(201).send()
    }
  )
}
