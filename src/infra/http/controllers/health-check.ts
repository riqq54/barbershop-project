import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const healthCheckController: FastifyPluginAsyncZod = async (app) => {
  app.get('/health', async () => 'ok')
}
