import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.ts'
import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { GetUserProfileUseCase } from './get-user-profile.ts'

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be possible to get user profile', async () => {
    const user = makeUser({
      login: 'john.doe',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: expect.objectContaining({
        login: 'john.doe',
      }),
    })
  })

  it('should not be possible to get user profile with wrong id', async () => {
    const result = await sut.execute({
      userId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
