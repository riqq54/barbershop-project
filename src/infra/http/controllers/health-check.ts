import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const healthCheckController: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        description: 'Health Check Route',
        response: {
          200: z.null().describe('ok'),
        },
      },
    },
    async () => 'ok'
  )
}
