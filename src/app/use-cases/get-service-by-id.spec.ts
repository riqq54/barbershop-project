import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { makeService } from '@/test/factories/make-service.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { GetServiceByIdUseCase } from './get-service-by-id.ts'

let inMemoryServicesRepository: InMemoryServicesRepository

let sut: GetServiceByIdUseCase

describe('Get Service By ID', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()

    sut = new GetServiceByIdUseCase(inMemoryServicesRepository)
  })

  it('should be possible to get a service by ID', async () => {
    const service = makeService({
      name: 'Corte de cabelo',
    })

    inMemoryServicesRepository.items.push(service)

    const result = await sut.execute({
      serviceId: service.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      service: expect.objectContaining({
        name: 'Corte de cabelo',
      }),
    })
  })

  it('should not be possible to get service with wrong id', async () => {
    const result = await sut.execute({
      serviceId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
