import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'

export interface ServiceProps {
  name: string
  description?: string | null
  valueInCents: number
  durationInMinutes: number
  createdAt: Date
  updatedAt?: Date | null
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

  get valueInCents() {
    return this.props.valueInCents
  }

  set valueInCents(valueInCents: number) {
    this.props.valueInCents = valueInCents
    this.touch()
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ServiceProps, 'createdAt' | 'description'>,
    id?: UniqueEntityID
  ) {
    const service = new Service(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        description: props.description ?? null,
      },
      id
    )

    return service
  }
}
