import { Service } from '../entities/service.ts'

export interface ServicesRepository {
  create(service: Service): Promise<void>
}
