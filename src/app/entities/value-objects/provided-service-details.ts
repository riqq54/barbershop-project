import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ValueObject } from '@/core/entities/value-objects.ts'

export interface ProvidedServiceDetailsProps {
  providedServiceId: UniqueEntityID
  barberId: UniqueEntityID
  barber: string
  clientId: UniqueEntityID
  client: string
  serviceId: UniqueEntityID
  service: string
  valueInCents: number
  createdAt: Date
}

export class ProvidedServiceDetails extends ValueObject<ProvidedServiceDetailsProps> {
  get providedServiceId() {
    return this.props.providedServiceId
  }

  get barberId() {
    return this.props.barberId
  }

  get barber() {
    return this.props.barber
  }

  get clientId() {
    return this.props.clientId
  }

  get client() {
    return this.props.client
  }

  get serviceId() {
    return this.props.serviceId
  }

  get service() {
    return this.props.service
  }

  get valueInCents() {
    return this.props.valueInCents
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: ProvidedServiceDetailsProps) {
    return new ProvidedServiceDetails(props)
  }
}
