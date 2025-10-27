import { Entity } from '@/core/entities/entity.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Optional } from '@/core/types/optional.ts'

export interface AppointmentProps {
  clientId: UniqueEntityID
  barberId: UniqueEntityID
  serviceId: UniqueEntityID
  durationInMinutes: number
  startsAt: Date
  completedAt?: Date | null
  canceledAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Appointment extends Entity<AppointmentProps> {
  get clientId() {
    return this.props.clientId
  }

  get barberId() {
    return this.props.barberId
  }

  get serviceId() {
    return this.props.serviceId
  }

  get durationInMinutes() {
    return this.props.durationInMinutes
  }

  get startsAt(){
    return this.props.startsAt
  }

  get completedAt(){
    return this.props.completedAt
  }

  set completedAt(date: Date | null | undefined){
    this.props.completedAt = date
    this.touch()
  }

  get canceledAt(){
    return this.props.canceledAt
  }

  set canceledAt(date: Date | null | undefined){
    this.props.canceledAt = date
    this.touch()
  }

  get status() {
    if (this.props.canceledAt) {
      return 'CANCELED'
    }
    
    if (this.props.completedAt) {
      return 'COMPLETED'
    }
    
    return 'SCHEDULED'
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
    props: Optional<AppointmentProps, 'createdAt' | 'completedAt' | 'canceledAt'>,
    id?: UniqueEntityID
  ) {
    const appointment = new Appointment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return appointment
  }
}
