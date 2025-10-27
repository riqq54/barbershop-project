import { InMemoryAppointmentsRepository } from '@/test/repositories/in-memory-appointments-repository.ts'
import { CreateAppointmentUseCase } from './create-appointment.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { makeService } from '@/test/factories/make-service.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { makeAppointment } from '@/test/factories/make-appointment.ts'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let inMemoryServicesRepository: InMemoryServicesRepository

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: CreateAppointmentUseCase

describe('Create Appointment Use Case', () => {
  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository()

    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new CreateAppointmentUseCase(inMemoryAppointmentsRepository, inMemoryServicesRepository)
  })

  it('should be possible to create a new appointment', async () => {

    const barber = makeUser({
      role: 'BARBER'
    })

    inMemoryUsersRepository.items.push(barber)

    const client = makeUser({
      role: 'CLIENT'
    })

    inMemoryUsersRepository.items.push(client)

    const service = makeService({
      durationInMinutes: 60
    })

    inMemoryServicesRepository.items.push(service)

    const result = await sut.execute({
      barberId: barber.id.toString(),
      clientId: client.id.toString(),
      serviceId: service.id.toString(),
      startsAt: new Date(2025, 10, 25, 13, 0, 0)
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      appointment: inMemoryAppointmentsRepository.items[0],
    })
  })

  it('should not be possible to create an overlapping appointment', async () => {

    const barber = makeUser({
      role: 'BARBER'
    })

    inMemoryUsersRepository.items.push(barber)

    const client = makeUser({
      role: 'CLIENT'
    })

    inMemoryUsersRepository.items.push(client)

    const service = makeService({
      durationInMinutes: 60
    })

    inMemoryServicesRepository.items.push(service)

    const existingAppointment = makeAppointment({
      barberId: barber.id,
      clientId: client.id,
      serviceId: service.id,
      startsAt: new Date(2025, 10, 25, 13, 0, 0),
      durationInMinutes: service.durationInMinutes
    })

    inMemoryAppointmentsRepository.items.push(existingAppointment)

    const result = await sut.execute({
      barberId: barber.id.toString(),
      clientId: client.id.toString(),
      serviceId: service.id.toString(),
      startsAt: new Date(2025, 10, 25, 13, 30, 0)
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryAppointmentsRepository.items).toHaveLength(1)
  })
})
