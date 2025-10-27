/** biome-ignore-all lint/suspicious/useAwait: <shhh> */
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { makeCreateAppointmentUseCase } from './factories/make-create-appointment-use-case.ts'
import { OverlappingAppointmentError } from '@/app/use-cases/errors/overlapping-appointment-error.ts'
import { AppointmentPresenter, AppointmentPresenterSchema } from '../presenters/appointment-presenter.ts'

export const createAppointmentController: FastifyPluginAsyncZod = async (app) => {
  const createAppointmentUseCase = makeCreateAppointmentUseCase()

  app.post(
    '/appointments',
    {
      schema: {
        tags: ['Agendamentos'],
        summary: 'Cria um novo agendamento.',
        security: [{ bearerAuth: [] }],
        body: z.object({
          barberId: z.uuid(),
          serviceId: z.uuid(),
          startsAt: z.coerce.date()
        }),
        response: {
          201: z
            .object({
              appointment: AppointmentPresenterSchema,
            })
            .describe('Appointment created!'),
          409: z
            .object({
              message: z.string(),
            })
            .describe('Overlapping appointment!'),
        },
      },
    },
    async (request, reply) => {
      const clientId = request.user.sub
      
      const { barberId, serviceId, startsAt } =
        request.body

      const result = await createAppointmentUseCase.execute({
        barberId,
        clientId,
        serviceId,
        startsAt,
      })

      if (result.isLeft()) {
        const error = result.value
        
        switch (error.constructor) {
          case OverlappingAppointmentError:
            return reply.status(409).send({
              message: error.message,
            })
          default:
            throw new Error('createAppointmentUseCase returned left')
        }
      }

      const { appointment } = result.value

      return reply
        .status(201)
        .send({ appointment: AppointmentPresenter.toHTTP(appointment) })
    }
  )
}
