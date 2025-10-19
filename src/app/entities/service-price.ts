import { Entity } from '@/core/entities/entity.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Optional } from '@/core/types/optional.ts'

export interface ServicePriceProps {
  serviceId: UniqueEntityID
  valueInCents: number
  startDate: Date
  endDate?: Date | null
}

export class ServicePrice extends Entity<ServicePriceProps> {
  get serviceId() {
    return this.props.serviceId
  }

  get valueInCents() {
    return this.props.valueInCents
  }

  get startDate() {
    return this.props.startDate
  }

  get endDate() {
    return this.props.endDate
  }

  set endDate(date) {
    this.props.endDate = date
  }

  static create(
    props: Optional<ServicePriceProps, 'startDate' | 'endDate'>,
    id?: UniqueEntityID
  ) {
    const servicePrice = new ServicePrice(
      {
        ...props,
        startDate: props.startDate ?? new Date(),
        endDate: props.endDate ?? null,
      },
      id
    )

    return servicePrice
  }
}
