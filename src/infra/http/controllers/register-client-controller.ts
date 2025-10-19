/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { UserAlreadyExistsError } from '@/app/use-cases/errors/user-already-exists-error.ts'
import { makeRegisterClientUseCase } from './factories/make-register-client-use-case.ts'

export const registerClientController: FastifyPluginAsyncZod = async (app) => {
  const registerClientUseCase = makeRegisterClientUseCase()

  app.post(
    '/accounts',
    {
      schema: {
        tags: ['Autenticação & Cadastro'],
        summary: 'Registra um novo cliente.',
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

      const result = await registerClientUseCase.execute({
        name,
        login,
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
