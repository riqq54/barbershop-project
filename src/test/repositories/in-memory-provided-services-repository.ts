import { ProvidedService } from "@/app/entities/provided-service.ts";
import { ProvidedServicesRepository } from "@/app/repositories/provided-services-repository.ts";

export class InMemoryProvidedServicesRepository implements ProvidedServicesRepository {

  public items: ProvidedService[] = []

  async create(providedService: ProvidedService): Promise<void> {
    this.items.push(providedService)
  }
}