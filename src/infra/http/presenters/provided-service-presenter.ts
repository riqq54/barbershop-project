import { ProvidedService } from '@/app/entities/provided-service.ts'
import z from 'zod'

export const ProvidedServicePresenterSchema = z.object({
  id: z.uuid(),
  barberId: z.uuid(),
  clientId: z.uuid(),
  serviceId: z.uuid(),
  valueInCents: z.number(),
  createdAt: z.date(),
})

type providedServicePresenterSchema = z.infer<typeof ProvidedServicePresenterSchema>

export class ProvidedServicePresenter {
  static toHTTP(providedService: ProvidedService): providedServicePresenterSchema {
    return {
      id: providedService.id.toString(),
      barberId: providedService.barberId.toString(),
      clientId: providedService.clientId.toString(),
      serviceId: providedService.serviceId.toString(),
      valueInCents: providedService.valueInCents,
      createdAt: providedService.createdAt,
    }
  }
}
