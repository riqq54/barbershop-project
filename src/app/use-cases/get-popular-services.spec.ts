import { makeProvidedService } from '@/test/factories/make-provided-service.ts'
import { makeService } from '@/test/factories/make-service.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryProvidedServicesRepository } from '@/test/repositories/in-memory-provided-services-repository.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { GetPopularServicesUseCase } from './get-popular-services.ts'

let inMemoryProvidedServicesRepository: InMemoryProvidedServicesRepository
let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let sut: GetPopularServicesUseCase

describe('Get Popular Services', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    inMemoryProvidedServicesRepository = new InMemoryProvidedServicesRepository(
      inMemoryServicesRepository,
      inMemoryUsersRepository
    )

    sut = new GetPopularServicesUseCase(inMemoryProvidedServicesRepository)
  })

  it('should be possible to get popular services', async () => {
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

    inMemoryServicesRepository.items.push(servico1)
    inMemoryServicesRepository.items.push(servico2)
    inMemoryServicesRepository.items.push(servico3)

    for (let i = 0; i < 10; i++) {
      inMemoryProvidedServicesRepository.create(
        makeProvidedService({
          barberId: barbeiro.id,
          clientId: cliente.id,
          serviceId: servico1.id,
          valueInCents: servico1.currentValueInCents,
        })
      )
    }

    for (let i = 0; i < 15; i++) {
      inMemoryProvidedServicesRepository.create(
        makeProvidedService({
          barberId: barbeiro.id,
          clientId: cliente.id,
          serviceId: servico2.id,
          valueInCents: servico2.currentValueInCents,
        })
      )
    }

    for (let i = 0; i < 20; i++) {
      inMemoryProvidedServicesRepository.create(
        makeProvidedService({
          barberId: barbeiro.id,
          clientId: cliente.id,
          serviceId: servico3.id,
          valueInCents: servico3.currentValueInCents,
        })
      )
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'service3',
          amount: 20,
        }),
        expect.objectContaining({
          service: 'service2',
          amount: 15,
        }),
        expect.objectContaining({
          service: 'service1',
          amount: 10,
        }),
      ])
    )
  })
})
