import { makeUser } from '@/test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts'
import { FetchUserUseCase } from './fetch-users.ts'

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: FetchUserUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new FetchUserUseCase(inMemoryUsersRepository)
  })

  it('should be possible to fetch users', async () => {
    await inMemoryUsersRepository.create(
      makeUser({
        login: 'user1',
      })
    )

    await inMemoryUsersRepository.create(
      makeUser({
        login: 'user2',
      })
    )

    await inMemoryUsersRepository.create(
      makeUser({
        login: 'user3',
      })
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.totalCount).toBe(3)
  })

  it('should be possible to fetch paginated users', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryUsersRepository.create(
        makeUser({
          login: `user${i}`,
        })
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.users).toHaveLength(2)
    expect(result.value?.totalCount).toBe(22)
  })

  it('should be possible to fetch filtered users', async () => {
    await inMemoryUsersRepository.create(
      makeUser({
        name: 'Henrique 1',
      })
    )

    await inMemoryUsersRepository.create(
      makeUser({
        name: 'Henrique 2',
      })
    )

    await inMemoryUsersRepository.create(
      makeUser({
        name: 'John Doe',
      })
    )

    const result = await sut.execute({
      page: 1,
      queryParams: {
        q: 'Henrique',
      },
    })

    expect(result.value?.totalCount).toBe(2)
  })

  it('should be possible to fetch users filtered by role', async () => {
    await inMemoryUsersRepository.create(
      makeUser({
        role: 'BARBER',
      })
    )

    await inMemoryUsersRepository.create(
      makeUser({
        role: 'BARBER',
      })
    )

    await inMemoryUsersRepository.create(
      makeUser({
        role: 'CLIENT',
      })
    )

    const result = await sut.execute({
      page: 1,
      queryParams: {
        role: 'BARBER',
      },
    })

    expect(result.value?.totalCount).toBe(2)
  })
})
