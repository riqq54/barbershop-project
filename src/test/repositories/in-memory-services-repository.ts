/** biome-ignore-all lint/suspicious/useAwait: <interface> */
import { Service } from '@/app/entities/service.ts'
import { ServicesRepository } from '@/app/repositories/services-repository.ts'

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = []

  async create(service: Service): Promise<void> {
    this.items.push(service)
  }
}
