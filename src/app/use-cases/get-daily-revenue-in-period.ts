import { Either, right } from '@/core/either.ts'
import { ProvidedServicesRepository } from '../repositories/provided-services-repository.ts'

type GetDailyRevenueInPeriodUseCaseResponse = Either<
  null,
  {
    date: string
    revenue: string
  }[]
>

export class GetDailyRevenueInPeriodUseCase {
  constructor(private providedServicesRepository: ProvidedServicesRepository) {}

  async execute(): Promise<GetDailyRevenueInPeriodUseCaseResponse> {
    const dailyResults =
      await this.providedServicesRepository.findDailyRevenueInPeriod()

    return right(dailyResults)
  }
}
