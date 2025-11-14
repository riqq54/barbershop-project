import { ProvidedService } from "../entities/provided-service.ts";

export interface ProvidedServicesRepository {
  create(providedService: ProvidedService): Promise<void>
}