import { Either, right } from '@/core/either.ts'
import { ProvidedServiceDetails } from '../entities/value-objects/provided-service-details.ts'
import {
  FindManyProvidedServicesDetailsByBarberIdQueryParams,
  ProvidedServicesRepository,
} from '../repositories/provided-services-repository.ts'

interface FetchProvidedServicesByBarberIdUseCaseRequest {
  barberId: string
  page: number
  queryParams?: FindManyProvidedServicesDetailsByBarberIdQueryParams
}

type FetchProvidedServicesByBarberIdUseCaseResponse = Either<
  null,
  {
    providedServices: ProvidedServiceDetails[]
    totalCount: number
  }
>

export class FetchProvidedServicesByBarberIdUseCase {
  constructor(private providedServicesRepository: ProvidedServicesRepository) {}

  async execute({
    barberId,
    page,
    queryParams,
  }: FetchProvidedServicesByBarberIdUseCaseRequest): Promise<FetchProvidedServicesByBarberIdUseCaseResponse> {
    const { providedServices, totalCount } =
      await this.providedServicesRepository.findManyDetailsByBarberId(
        barberId,
        { page },
        queryParams
      )

    return right({ providedServices, totalCount })
  }
}
