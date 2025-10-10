/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import {
  UserProfilePresenter,
  UserProfilePresenterSchema,
} from '../presenters/user-profile-presenter.ts'
import { makeGetUserProfileUseCase } from './factories/make-get-user-profile-use-case.ts'

export const getUserProfileController: FastifyPluginAsyncZod = async (app) => {
  const getUserProfileUseCase = makeGetUserProfileUseCase()

  app.get(
    '/me',
    {
      schema: {
        // tags: ['auth'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z
            .object({
              user: UserProfilePresenterSchema,
            })
            .describe('Returns authenticated user profile'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Resource not found.'),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Bad Request.'),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const result = await getUserProfileUseCase.execute({ userId })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return reply.status(404).send({
              message: error.message,
            })
          default:
            return reply.status(400).send({
              message: error.message,
            })
        }
      }

      const { user } = result.value

      return reply.status(200).send({ user: UserProfilePresenter.toHTTP(user) })
    }
  )
}
