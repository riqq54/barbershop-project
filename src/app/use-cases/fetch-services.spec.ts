import { makeService } from '@/test/factories/make-service.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { FetchServicesUseCase } from './fetch-services.ts'

let inMemoryServicesRepository: InMemoryServicesRepository

let sut: FetchServicesUseCase

describe('Fetch Services Use Case', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()

    sut = new FetchServicesUseCase(inMemoryServicesRepository)
  })

  it('should be possible to fetch services', async () => {
    await inMemoryServicesRepository.create(
      makeService({
        name: 'service1',
      })
    )

    await inMemoryServicesRepository.create(
      makeService({
        name: 'service2',
      })
    )

    await inMemoryServicesRepository.create(
      makeService({
        name: 'service3',
      })
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.totalCount).toBe(3)
  })

  it('should be possible to fetch paginated services', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryServicesRepository.create(
        makeService({
          name: `service${i}`,
        })
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.services).toHaveLength(2)
    expect(result.value?.totalCount).toBe(22)
  })

  it('should be possible to fetch filtered services', async () => {
    await inMemoryServicesRepository.create(
      makeService({
        name: 'Corte de cabelo',
      })
    )

    await inMemoryServicesRepository.create(
      makeService({
        name: 'Corte de barba',
      })
    )

    await inMemoryServicesRepository.create(
      makeService({
        name: 'Pigmentação',
      })
    )

    const result = await sut.execute({
      page: 1,
      queryParams: {
        q: 'Corte',
      },
    })

    expect(result.value?.totalCount).toBe(2)
  })

  it('should fetch only active services', async () => {
    const servicoAtivo = makeService({
      name: 'ativo',
    })

    await inMemoryServicesRepository.create(servicoAtivo)

    const servicoInativo = makeService({
      name: 'inativo',
    })

    servicoInativo.inactivate()

    await inMemoryServicesRepository.create(servicoInativo)

    const result = await sut.execute({ page: 1 })

    expect(result.value?.totalCount).toBe(1)
  })
})
