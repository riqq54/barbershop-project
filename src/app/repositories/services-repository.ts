import { Service } from '../entities/service.ts'

export interface ServicesRepository {
  findById(id: string): Promise<null | Service>
  create(service: Service): Promise<void>
}
