/** biome-ignore-all lint/suspicious/useAwait: teste */

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { makeFetchAvailableAppointmentTimesUseCase } from './factories/make-fetch-available-appointment-times.ts'

export const fetchAvailableAppointmentTimesController: FastifyPluginAsyncZod =
  async (app) => {
    const fetchAvailableAppointmentTimesUseCase =
      makeFetchAvailableAppointmentTimesUseCase()

    app.get(
      '/appointments/available-times',
      {
        schema: {
          tags: ['Agendamentos'],
          summary: 'Busca horários disponíveis para agendamento.',
          security: [{ bearerAuth: [] }],
          querystring: z.object({
            barberId: z.uuid(),
            serviceId: z.uuid(),
            date: z.coerce.date(),
          }),
          response: {
            200: z
              .object({
                availableTimes: z.array(z.string()),
              })
              .describe('Returns availableTimes for barber and date'),
            404: z
              .object({
                message: z.string(),
              })
              .describe('Service not found.'),
          },
        },
      },
      async (request, reply) => {
        const { barberId, serviceId, date } = request.query

        const result = await fetchAvailableAppointmentTimesUseCase.execute({
          barberId,
          serviceId,
          date,
        })

        if (result.isLeft()) {
          const error = result.value

          switch (error.constructor) {
            case ResourceNotFoundError:
              return reply.status(404).send({
                message: error.message,
              })
            default:
              throw new Error('createAppointmentUseCase returned left')
          }
        }

        const { availableTimes } = result.value

        return reply.status(200).send({ availableTimes })
      }
    )
  }
