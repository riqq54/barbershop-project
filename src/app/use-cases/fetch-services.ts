import { Either, right } from '@/core/either.ts'
import { Service } from '../entities/service.ts'
import {
  FindManyServicesQueryParams,
  ServicesRepository,
} from '../repositories/services-repository.ts'

interface FetchServiceUseCaseRequest {
  page: number
  queryParams?: FindManyServicesQueryParams
}

type FetchServiceUseCaseResponse = Either<
  null,
  {
    services: Service[]
    totalCount: number
  }
>

export class FetchServicesUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    page,
    queryParams,
  }: FetchServiceUseCaseRequest): Promise<FetchServiceUseCaseResponse> {
    const { services, totalCount } = await this.servicesRepository.findMany(
      { page },
      queryParams
    )

    return right({ services, totalCount })
  }
}
