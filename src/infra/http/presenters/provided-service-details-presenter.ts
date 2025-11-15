import z from 'zod'
import { ProvidedServiceDetails } from '@/app/entities/value-objects/provided-service-details.ts'

export const ProvidedServiceDetailsPresenterSchema = z.object({
  providedServiceId: z.uuid(),
  barberId: z.uuid(),
  barber: z.string(),
  clientId: z.uuid(),
  client: z.string(),
  serviceId: z.uuid(),
  service: z.string(),
  valueInCents: z.number(),
  createdAt: z.date(),
})

type providedServiceDetailsPresenterSchema = z.infer<
  typeof ProvidedServiceDetailsPresenterSchema
>

export class ProvidedServiceDetailsPresenter {
  static toHTTP(
    providedServiceDetails: ProvidedServiceDetails
  ): providedServiceDetailsPresenterSchema {
    return {
      providedServiceId: providedServiceDetails.providedServiceId.toString(),
      barberId: providedServiceDetails.barberId.toString(),
      barber: providedServiceDetails.barber,
      clientId: providedServiceDetails.clientId.toString(),
      client: providedServiceDetails.client,
      serviceId: providedServiceDetails.serviceId.toString(),
      service: providedServiceDetails.service,
      valueInCents: providedServiceDetails.valueInCents,
      createdAt: providedServiceDetails.createdAt,
    }
  }
}
