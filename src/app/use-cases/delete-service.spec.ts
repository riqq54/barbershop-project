import { makeService } from '@/test/factories/make-service.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { DeleteServiceUseCase } from './delete-service.ts'

let inMemoryServicesRepository: InMemoryServicesRepository

let sut: DeleteServiceUseCase

describe('Delete Service', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()

    sut = new DeleteServiceUseCase(inMemoryServicesRepository)
  })

  it('should be possible to delete a service', async () => {
    const service = makeService({
      name: 'Corte de cabelo',
    })

    inMemoryServicesRepository.items.push(service)

    const result = await sut.execute({
      serviceId: service.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryServicesRepository.items[0].deletedAt).toBeDefined()
  })
})
