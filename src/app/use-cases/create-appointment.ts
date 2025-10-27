import { Either, left, right } from '@/core/either.ts'
import { Appointment } from '../entities/appointment.ts'
import { ServicesRepository } from '../repositories/services-repository.ts'
import { AppointmentsRepository } from '../repositories/appointments-repository.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { OverlappingAppointmentError } from './errors/overlapping-appointment-error.ts'

interface CreateAppointmentUseCaseRequest {
  barberId: string
  clientId: string
  serviceId: string
  startsAt: Date
}

type CreateAppointmentUseCaseResponse = Either<ResourceNotFoundError | OverlappingAppointmentError, { appointment: Appointment }>

export class CreateAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository
  ) {}

  async execute({
    barberId,
    clientId,
    serviceId,
    startsAt,
  }: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {

    const service = await this.servicesRepository.findById(serviceId)
    
    if(!service){
      return left(new ResourceNotFoundError())
    }

    const { durationInMinutes } = service

    const isOverlapping = await this.appointmentsRepository.findOverlappingAppointment(barberId, startsAt, durationInMinutes)

    if(isOverlapping){
      return left(new OverlappingAppointmentError())
    }
    
    const appointment = Appointment.create({
      barberId: new UniqueEntityID(barberId),
      clientId: new UniqueEntityID(clientId),
      serviceId: new UniqueEntityID(serviceId),
      durationInMinutes,
      startsAt,
    })

    await this.appointmentsRepository.create(appointment)

    return right({ appointment })
  }
}
