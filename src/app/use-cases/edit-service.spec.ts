import { makeService } from '@/test/factories/make-service.ts'
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts'
import { EditServiceUseCase } from './edit-service.ts'

let inMemoryServicesRepository: InMemoryServicesRepository

let sut: EditServiceUseCase

describe('Create Service Use Case', () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServicesRepository()

    sut = new EditServiceUseCase(inMemoryServicesRepository)
  })

  it('should be possible to edit an existing service', async () => {
    const service = makeService({
      name: 'Service',
      durationInMinutes: 30,
      initialValueInCents: 4500,
    })
    inMemoryServicesRepository.create(service)

    const result = await sut.execute({
      serviceId: service.id.toString(),
      name: 'Edited service',
      description: 'Edited description',
      durationInMinutes: 45,
      valueInCents: 5500,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      service: inMemoryServicesRepository.items[0],
    })
    expect(
      inMemoryServicesRepository.items[0].servicePrices[0].endDate
    ).toBeDefined()
    expect(
      inMemoryServicesRepository.items[0].servicePrices[1].endDate
    ).toBeNull()
  })
})
