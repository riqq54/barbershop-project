import z from 'zod'
import { Service } from '@/app/entities/service.ts'

export const ServicePresenterSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  valueInCents: z.number(),
  durationInMinutes: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
})

type servicePresenterSchema = z.infer<typeof ServicePresenterSchema>

export class ServicePresenter {
  static toHTTP(service: Service): servicePresenterSchema {
    return {
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      valueInCents: service.valueInCents,
      durationInMinutes: service.durationInMinutes,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt,
    }
  }
}
