import { Entity } from '@/core/entities/entity.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Optional } from '@/core/types/optional.ts'

export interface ProvidedServiceProps {
  barberId: UniqueEntityID
  clientId: UniqueEntityID
  serviceId: UniqueEntityID
  valueInCents: number
  createdAt: Date
}

export class ProvidedService extends Entity<ProvidedServiceProps> {
  get barberId(){
    return this.props.barberId
  }

  get clientId(){
    return this.props.clientId
  }

  get serviceId(){
    return this.props.serviceId
  }
  
  get valueInCents(){
    return this.props.valueInCents
  }
  
  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<ProvidedServiceProps, 'createdAt'>, id?: UniqueEntityID){
    const providedService = new ProvidedService({
      ...props,
      createdAt: props.createdAt ?? new Date()
    },
    id
  )

  return providedService
  }
}
