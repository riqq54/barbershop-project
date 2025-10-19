import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const healthCheckController: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        hide: true,
      },
    },
    async () => 'ok'
  )
}
