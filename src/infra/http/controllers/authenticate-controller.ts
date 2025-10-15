/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { InvalidCredentialsError } from '@/app/use-cases/errors/invalid-credentials-error.ts'
import { makeAuthenticateUserUseCase } from './factories/make-authenticate-user-use-case.ts'

export const authenticateController: FastifyPluginAsyncZod = async (app) => {
  const authenticateUserUseCase = makeAuthenticateUserUseCase()

  app.post(
    '/sessions',
    {
      schema: {
        tags: ['auth'],
        body: z.object({
          login: z.string(),
          password: z.string(),
        }),
        response: {
          200: z
            .object({
              access_token: z.jwt(),
            })
            .describe('Returns a JWT token'),
          401: z
            .object({
              message: z.string(),
            })
            .describe('Invalid credentials error.'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Bad Request.'),
        },
      },
    },
    async (request, reply) => {
      const { login, password } = request.body

      const result = await authenticateUserUseCase.execute({
        login,
        password,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case InvalidCredentialsError:
            return reply.status(401).send({
              message: error.message,
            })
          default:
            return reply.status(404).send({
              message: error.message,
            })
        }
      }

      const { user } = result.value

      const accessToken = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            expiresIn: '10m',
            sub: user.id.toValue(),
          },
        }
      )

      return reply.status(200).send({ access_token: accessToken })
    }
  )
}
