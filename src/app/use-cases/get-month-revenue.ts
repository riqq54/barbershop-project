import { Either, right } from '@/core/either.ts'
import { ProvidedServicesRepository } from '../repositories/provided-services-repository.ts'

type GetMonthRevenueUseCaseResponse = Either<
  null,
  {
    revenue: number
    diffFromLastMonth: number
  }
>

export class GetMonthRevenueUseCase {
  constructor(private providedServicesRepository: ProvidedServicesRepository) {}

  async execute(): Promise<GetMonthRevenueUseCaseResponse> {
    const providedServicesOnCurrentMonth =
      await this.providedServicesRepository.findManyOnCurrentMonth()

    const revenue = providedServicesOnCurrentMonth.reduce(
      (total, item) => total + item.valueInCents,
      0
    )

    const providedServicesOnLastMonth =
      await this.providedServicesRepository.findManyOnLastMonth()

    const lastMonthrevenue = providedServicesOnLastMonth.reduce(
      (total, item) => total + item.valueInCents,
      0
    )

    const diffFromLastMonth =
      ((revenue - lastMonthrevenue) / lastMonthrevenue) * 100

    return right({ revenue, diffFromLastMonth })
  }
}
