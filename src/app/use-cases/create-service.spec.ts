import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { CreateServiceUseCase } from './create-service.ts'

let inMemoryServicesRepository: InMemoryServicesRepository

let sut: CreateServiceUseCase

describe('Create Service Use Case', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()

    sut = new CreateServiceUseCase(inMemoryServicesRepository)
  })

  it('should be possible to create a new service', async () => {
    const result = await sut.execute({
      name: 'Corte',
      description: 'Corte de cabelo comum',
      valueInCents: 4500,
      durationInMinutes: 30,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      service: inMemoryServicesRepository.items[0],
    })
  })
})
