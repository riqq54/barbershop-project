import { makeProvidedService } from '@/test/factories/make-provided-service.ts'
import { makeService } from '@/test/factories/make-service.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryProvidedServicesRepository } from '@/test/repositories/in-memory-provided-services-repository.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { GetMonthProvidedServicesAmountUseCase } from './get-month-provided-services-amount.ts'

let inMemoryProvidedServicesRepository: InMemoryProvidedServicesRepository
let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let sut: GetMonthProvidedServicesAmountUseCase

describe('Get Month Provided Services Amount', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    inMemoryProvidedServicesRepository = new InMemoryProvidedServicesRepository(
      inMemoryServicesRepository,
      inMemoryUsersRepository
    )

    sut = new GetMonthProvidedServicesAmountUseCase(
      inMemoryProvidedServicesRepository
    )
  })

  it('should be possible to get current month revenue', async () => {
    const barbeiro = makeUser({
      login: 'barbeiro',
      name: 'barbeiro1',
      role: 'BARBER',
    })

    inMemoryUsersRepository.items.push(barbeiro)

    const cliente = makeUser({
      login: 'cliente',
      name: 'cliente1',
      role: 'CLIENT',
    })

    inMemoryUsersRepository.items.push(cliente)

    const servico = makeService({
      name: 'service1',
      initialValueInCents: 4500,
    })

    inMemoryServicesRepository.items.push(servico)

    const now = new Date()
    const lastMonthDate = new Date(now)

    lastMonthDate.setMonth(now.getMonth() - 1)

    for (let i = 0; i < 10; i++) {
      inMemoryProvidedServicesRepository.create(
        makeProvidedService({
          barberId: barbeiro.id,
          clientId: cliente.id,
          serviceId: servico.id,
          valueInCents: servico.currentValueInCents,
          createdAt: lastMonthDate,
        })
      )
    }

    for (let i = 0; i < 20; i++) {
      inMemoryProvidedServicesRepository.create(
        makeProvidedService({
          barberId: barbeiro.id,
          clientId: cliente.id,
          serviceId: servico.id,
          valueInCents: servico.currentValueInCents,
          createdAt: now,
        })
      )
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value?.amount).toBe(20)
    expect(result.value?.diffFromLastMonth).toEqual(100)
  })
})
