import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import { ServicePrice } from './service-price.ts'

export interface ServiceProps {
  name: string
  description?: string | null
  servicePrices: ServicePrice[]
  durationInMinutes: number
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Service extends Entity<ServiceProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null | undefined) {
    this.props.description = description ?? null
    this.touch()
  }

  get servicePrices() {
    return this.props.servicePrices
  }

  set servicePrices(servicePrices: ServicePrice[]) {
    this.props.servicePrices = servicePrices
  }

  get durationInMinutes() {
    return this.props.durationInMinutes
  }

  set durationInMinutes(durationInMinutes: number) {
    this.props.durationInMinutes = durationInMinutes
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  inactivate() {
    if (this.props.deletedAt) {
      return
    }

    this.props.deletedAt = new Date()
    this.touch()
  }

  get isActive() {
    return this.props.deletedAt === null
  }

  get currentValueInCents() {
    const currentPrice = this.servicePrices.find(
      (price) => price.endDate === null
    )

    return currentPrice ? currentPrice.valueInCents : 0
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ServiceProps, 'createdAt' | 'description' | 'deletedAt'>,
    id?: UniqueEntityID
  ) {
    const service = new Service(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        description: props.description ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id
    )

    return service
  }
}
