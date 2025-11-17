import { ProvidedService } from '../entities/provided-service.ts'
import { ProvidedServiceDetails } from '../entities/value-objects/provided-service-details.ts'
import { PaginationParams } from './pagination-params.ts'

export interface FindManyProvidedServicesDetailsByBarberIdQueryParams {
  q?: string
}

export interface ProvidedServicesRepository {
  create(providedService: ProvidedService): Promise<void>
  findManyDetailsByBarberId(
    barberId: string,
    params: PaginationParams,
    queryParams?: FindManyProvidedServicesDetailsByBarberIdQueryParams
  ): Promise<{ providedServices: ProvidedServiceDetails[]; totalCount: number }>
  findManyOnCurrentMonth(): Promise<ProvidedService[]>
  findManyOnLastMonth(): Promise<ProvidedService[]>
  findPopularServices(): Promise<{ service: string; amount: number }[]>
  findDailyRevenueInPeriod(): Promise<{ date: string; revenue: string }[]>
}
