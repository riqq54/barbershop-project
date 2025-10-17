import { Service } from '../entities/service.ts'
import { PaginationParams } from './pagination-params.ts'

export interface FindManyServicesQueryParams {
  q?: string
}

export interface ServicesRepository {
  findById(id: string): Promise<null | Service>
  findMany(
    params: PaginationParams,
    queryParams?: FindManyServicesQueryParams
  ): Promise<{ services: Service[]; totalCount: number }>
  create(service: Service): Promise<void>
}
