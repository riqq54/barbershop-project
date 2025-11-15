/** biome-ignore-all lint/suspicious/useAwait: promise await */
import { ProvidedService } from '@/app/entities/provided-service.ts'
import { ProvidedServiceDetails } from '@/app/entities/value-objects/provided-service-details.ts'
import { PaginationParams } from '@/app/repositories/pagination-params.ts'
import {
  FindManyProvidedServicesDetailsByBarberIdQueryParams,
  ProvidedServicesRepository,
} from '@/app/repositories/provided-services-repository.ts'
import { InMemoryServicesRepository } from './in-memory-services-repository.ts'
import { InMemoryUsersRepository } from './in-memory-users-repository.ts'

export class InMemoryProvidedServicesRepository
  implements ProvidedServicesRepository
{
  public items: ProvidedService[] = []

  constructor(
    private servicesRepository: InMemoryServicesRepository,
    private usersRepository: InMemoryUsersRepository
  ) {}

  async create(providedService: ProvidedService): Promise<void> {
    await this.items.push(providedService)
  }

  async findManyDetailsByBarberId(
    barberId: string,
    { page }: PaginationParams,
    queryParams?: FindManyProvidedServicesDetailsByBarberIdQueryParams
  ): Promise<{
    providedServices: ProvidedServiceDetails[]
    totalCount: number
  }> {
    let filteredProvidedServices = this.items
      .filter((item) => item.barberId.toString() === barberId)
      .map((providedService) => {
        const barber = this.usersRepository.items.find((user) =>
          user.id.equals(providedService.barberId)
        )

        if (!barber) {
          throw new Error(
            `Barber with ID "${providedService.barberId.toString()}" does not exist.`
          )
        }

        const client = this.usersRepository.items.find((user) =>
          user.id.equals(providedService.clientId)
        )

        if (!client) {
          throw new Error(
            `Client with ID "${providedService.clientId.toString()}" does not exist.`
          )
        }

        const service = this.servicesRepository.items.find((s) =>
          s.id.equals(providedService.serviceId)
        )

        if (!service) {
          throw new Error(
            `Service with ID "${providedService.serviceId.toString()}" does not exist.`
          )
        }

        return ProvidedServiceDetails.create({
          providedServiceId: providedService.id,
          barberId: providedService.barberId,
          barber: barber.name,
          clientId: providedService.clientId,
          client: client.name,
          serviceId: providedService.serviceId,
          service: service.name,
          valueInCents: providedService.valueInCents,
          createdAt: providedService.createdAt,
        })
      })

    if (queryParams?.q) {
      const search = queryParams?.q.toLowerCase()

      filteredProvidedServices = filteredProvidedServices.filter(
        (item) =>
          item.client.toLowerCase().includes(search) ||
          item.service.toLowerCase().includes(search)
      )
    }

    const totalCount = filteredProvidedServices.length
    const providedServices = filteredProvidedServices.slice(
      (page - 1) * 20,
      page * 20
    )

    return { providedServices, totalCount }
  }
}
