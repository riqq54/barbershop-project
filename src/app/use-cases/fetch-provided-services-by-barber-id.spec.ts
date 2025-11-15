import { makeProvidedService } from '@/test/factories/make-provided-service.ts'
import { makeService } from '@/test/factories/make-service.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryProvidedServicesRepository } from '@/test/repositories/in-memory-provided-services-repository.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { FetchProvidedServicesByBarberIdUseCase } from './fetch-provided-services-by-barber-id.ts'

let inMemoryProvidedServicesRepository: InMemoryProvidedServicesRepository
let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let sut: FetchProvidedServicesByBarberIdUseCase

describe('Fetch Provided Services by Barber Id Use Case', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()

    inMemoryUsersRepository = new InMemoryUsersRepository()

    inMemoryProvidedServicesRepository = new InMemoryProvidedServicesRepository(
      inMemoryServicesRepository,
      inMemoryUsersRepository
    )

    sut = new FetchProvidedServicesByBarberIdUseCase(
      inMemoryProvidedServicesRepository
    )
  })

  it('should be possible to fetch provided services by barber id', async () => {
    const barbeiro = makeUser({
      login: 'barbeiro',
      name: 'barbeiro1',
      role: 'BARBER',
    })

    await inMemoryUsersRepository.items.push(barbeiro)

    const cliente = makeUser({
      login: 'cliente',
      name: 'cliente1',
      role: 'CLIENT',
    })

    await inMemoryUsersRepository.items.push(cliente)

    const servico1 = makeService({
      name: 'service1',
      initialValueInCents: 4500,
    })

    const servico2 = makeService({
      name: 'service2',
      initialValueInCents: 4500,
    })

    const servico3 = makeService({
      name: 'service3',
      initialValueInCents: 4500,
    })

    await inMemoryServicesRepository.items.push(servico1)
    await inMemoryServicesRepository.items.push(servico2)
    await inMemoryServicesRepository.items.push(servico3)

    const providedService1 = makeProvidedService({
      barberId: barbeiro.id,
      clientId: cliente.id,
      serviceId: servico1.id,
      valueInCents: servico1.currentValueInCents,
    })

    const providedService2 = makeProvidedService({
      barberId: barbeiro.id,
      clientId: cliente.id,
      serviceId: servico2.id,
      valueInCents: servico2.currentValueInCents,
    })

    const providedService3 = makeProvidedService({
      barberId: barbeiro.id,
      clientId: cliente.id,
      serviceId: servico3.id,
      valueInCents: servico3.currentValueInCents,
    })

    await inMemoryProvidedServicesRepository.create(providedService1)
    await inMemoryProvidedServicesRepository.create(providedService2)
    await inMemoryProvidedServicesRepository.create(providedService3)

    const result = await sut.execute({
      barberId: barbeiro.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.providedServices).toHaveLength(3)
    expect(result.value?.totalCount).toBe(3)
    expect(result.value?.providedServices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          barber: 'barbeiro1',
          client: 'cliente1',
          service: 'service1',
        }),
        expect.objectContaining({
          barber: 'barbeiro1',
          client: 'cliente1',
          service: 'service2',
        }),
        expect.objectContaining({
          barber: 'barbeiro1',
          client: 'cliente1',
          service: 'service3',
        }),
      ])
    )
  })
})
