import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { makeAppointment } from '@/test/factories/make-appointment.ts'
import { makeService } from '@/test/factories/make-service.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryAppointmentsRepository } from '@/test/repositories/in-memory-appointments-repository.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { FetchAvailableAppointmentTimesUseCase } from './fetch-available-appointment-times.ts'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let inMemoryServicesRepository: InMemoryServicesRepository

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: FetchAvailableAppointmentTimesUseCase

describe('Fetch Available Appointment Times Use Case', () => {
  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository()

    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new FetchAvailableAppointmentTimesUseCase(
      inMemoryAppointmentsRepository,
      inMemoryServicesRepository
    )
  })

  it('should be possible to fetch available appointment times', async () => {
    await inMemoryServicesRepository.create(
      makeService(
        {
          name: 'service1',
          durationInMinutes: 30,
        },
        new UniqueEntityID('service-30m')
      )
    )

    const barber = makeUser({
      role: 'BARBER',
    })
    inMemoryUsersRepository.items.push(barber)

    const result = await sut.execute({
      barberId: barber.id.toString(),
      serviceId: 'service-30m',
      date: new Date(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.availableTimes[0]).toBe('09:00')
    expect(result.value?.availableTimes).not.toContain('17:40')
  })

  it('should not return unavailable appointment times', async () => {
    await inMemoryServicesRepository.create(
      makeService(
        {
          name: 'service1',
          durationInMinutes: 30,
        },
        new UniqueEntityID('service-30m')
      )
    )

    const barber = makeUser({
      role: 'BARBER',
    })
    inMemoryUsersRepository.items.push(barber)

    const existingAppointment = makeAppointment({
      barberId: barber.id,
      serviceId: new UniqueEntityID('service-30m'),
      startsAt: new Date(2025, 10, 25, 13, 0, 0),
      durationInMinutes: 30,
    })

    inMemoryAppointmentsRepository.items.push(existingAppointment)

    const result = await sut.execute({
      barberId: barber.id.toString(),
      serviceId: 'service-30m',
      date: new Date(2025, 10, 25, 0, 0, 0),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.availableTimes).not.toContain('13:10')
    expect(result.value?.availableTimes).not.toContain('12:40')
    expect(result.value?.availableTimes).toContain('12:30')
    expect(result.value?.availableTimes).toContain('13:30')
  })
})
