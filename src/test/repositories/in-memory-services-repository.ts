/** biome-ignore-all lint/suspicious/useAwait: <interface> */
import { Service } from '@/app/entities/service.ts'
import { PaginationParams } from '@/app/repositories/pagination-params.ts'
import {
  FindManyServicesQueryParams,
  ServicesRepository,
} from '@/app/repositories/services-repository.ts'

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = []

  async create(service: Service): Promise<void> {
    this.items.push(service)
  }

  async findById(id: string): Promise<null | Service> {
    const service = this.items.find((item) => item.id.toString() === id)

    if (!service) {
      return null
    }

    return service
  }

  async findMany(
    { page }: PaginationParams,
    queryParams?: FindManyServicesQueryParams
  ): Promise<{ services: Service[]; totalCount: number }> {
    let filteredItems = this.items.filter((item) => item.deletedAt === null)

    if (queryParams?.q) {
      const search = queryParams?.q.toLowerCase()

      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(search)
      )
    }

    const totalCount = filteredItems.length
    const services = filteredItems.slice((page - 1) * 20, page * 20)

    return { services, totalCount }
  }

  async save(service: Service): Promise<null> {
    const itemIndex = this.items.findIndex((item) => item.id === service.id)

    this.items[itemIndex] = service

    return null
  }
}
