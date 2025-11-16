import { hash } from 'bcryptjs'
import { prisma } from '@/infra/database/prisma/prisma.ts'

async function seed() {
  const now = new Date()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const ID_GERENTE = 'a64df12f-a008-4e4c-9b5a-2277b41a6579'
  const ID_BARBEIRO = '0b2a7947-5936-4287-b3c2-59e845807a1c'
  const ID_CLIENTE = 'ec32ba15-6def-4c98-9c94-791aa9f269c0'

  await prisma.user.createMany({
    data: [
      {
        id: ID_GERENTE,
        login: 'manager',
        name: 'Usuário Gerente',
        role: 'MANAGER',
        password: await hash('123456', 8),
        createdAt: lastMonthStart,
      },
      {
        id: ID_BARBEIRO,
        login: 'barber',
        name: 'Usuário Barbeiro',
        role: 'BARBER',
        password: await hash('123456', 8),
        createdAt: lastMonthStart,
      },
      {
        id: ID_CLIENTE,
        login: 'client',
        name: 'Usuário Cliente',
        role: 'CLIENT',
        password: await hash('123456', 8),
        createdAt: lastMonthStart,
      },
    ],
  })

  const VALOR_SERVICO_1 = 5000
  const ID_SERVICO_1 = '8161a114-76aa-4a01-a48d-197b98dd5b0a'

  const VALOR_SERVICO_2 = 12_000
  const ID_SERVICO_2 = '3ab27ec6-7051-4aba-a196-855a54ecc1f6'

  const VALOR_SERVICO_3 = 4000
  const ID_SERVICO_3 = 'c9f234d2-6475-4efd-9b83-423060c8230b'

  const VALOR_SERVICO_4 = 6500
  const ID_SERVICO_4 = '1e771f7d-5241-4bb0-ac99-36c99b002c04'

  const VALOR_SERVICO_5 = 4500
  const ID_SERVICO_5 = 'ed59be6a-7a19-4371-9327-fcb40bb6fa83'

  await Promise.all([
    prisma.service.create({
      data: {
        id: ID_SERVICO_1,
        name: 'Corte Masculino',
        description:
          'Corte de cabelo com máquina. Inclui lavagem e finalização básica.',
        durationInMinutes: 45,
        createdAt: lastMonthStart,
        servicePrices: {
          create: {
            valueInCents: VALOR_SERVICO_1,
            startDate: lastMonthStart,
          },
        },
      },
    }),
    prisma.service.create({
      data: {
        id: ID_SERVICO_2,
        name: 'Combo Corte e Barboterapia',
        description:
          'Corte de cabelo completo + experiência relaxante de Barboterapia (toalha quente, espuma e massagem facial).',
        durationInMinutes: 90,
        createdAt: lastMonthStart,
        servicePrices: {
          create: {
            valueInCents: VALOR_SERVICO_2,
            startDate: lastMonthStart,
          },
        },
      },
    }),
    prisma.service.create({
      data: {
        id: ID_SERVICO_3,
        name: 'Hidratação Capilar',
        description:
          'Tratamento intensivo para repor nutrientes, brilho e maciez aos fios. Ideal para cabelos secos ou danificados.',
        durationInMinutes: 30,
        createdAt: lastMonthStart,
        servicePrices: {
          create: {
            valueInCents: VALOR_SERVICO_3,
            startDate: lastMonthStart,
          },
        },
      },
    }),
    prisma.service.create({
      data: {
        id: ID_SERVICO_4,
        name: 'Corte na Tesoura',
        description:
          'Corte de cabelo realizado exclusivamente com tesoura, proporcionando um acabamento mais detalhado e gradual. Inclui lavagem.',
        durationInMinutes: 60,
        createdAt: lastMonthStart,
        servicePrices: {
          create: {
            valueInCents: VALOR_SERVICO_4,
            startDate: lastMonthStart,
          },
        },
      },
    }),
    prisma.service.create({
      data: {
        id: ID_SERVICO_5,
        name: 'Barba Tradicional',
        description:
          'Desenho e remoção da barba com navalha, utilizando espuma e finalização com pós-barba.',
        durationInMinutes: 30,
        createdAt: lastMonthStart,
        servicePrices: {
          create: {
            valueInCents: VALOR_SERVICO_5,
            startDate: lastMonthStart,
          },
        },
      },
    }),
  ])

  // SERVIÇOS PRESTADOS NO MÊS PASSADO

  for (let i = 0; i < 10; i++) {
    const lastMonthDay = new Date(lastMonthStart)
    lastMonthDay.setDate(lastMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_1,
        valueInCents: VALOR_SERVICO_1,
        createdAt: lastMonthDay,
      },
    })
  }

  for (let i = 0; i < 10; i++) {
    const lastMonthDay = new Date(lastMonthStart)
    lastMonthDay.setDate(lastMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_2,
        valueInCents: VALOR_SERVICO_2,
        createdAt: lastMonthDay,
      },
    })
  }

  for (let i = 0; i < 10; i++) {
    const lastMonthDay = new Date(lastMonthStart)
    lastMonthDay.setDate(lastMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_3,
        valueInCents: VALOR_SERVICO_3,
        createdAt: lastMonthDay,
      },
    })
  }

  for (let i = 0; i < 10; i++) {
    const lastMonthDay = new Date(lastMonthStart)
    lastMonthDay.setDate(lastMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_4,
        valueInCents: VALOR_SERVICO_4,
        createdAt: lastMonthDay,
      },
    })
  }

  for (let i = 0; i < 10; i++) {
    const lastMonthDay = new Date(lastMonthStart)
    lastMonthDay.setDate(lastMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_5,
        valueInCents: VALOR_SERVICO_5,
        createdAt: lastMonthDay,
      },
    })
  }

  // SERVIÇOS PRESTADOS NO MÊS ATUAL

  for (let i = 0; i < 15; i++) {
    const currentMonthDay = new Date(currentMonthStart)
    currentMonthDay.setDate(currentMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_1,
        valueInCents: VALOR_SERVICO_1,
        createdAt: currentMonthDay,
      },
    })
  }

  for (let i = 0; i < 15; i++) {
    const currentMonthDay = new Date(currentMonthStart)
    currentMonthDay.setDate(currentMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_2,
        valueInCents: VALOR_SERVICO_2,
        createdAt: currentMonthDay,
      },
    })
  }

  for (let i = 0; i < 15; i++) {
    const currentMonthDay = new Date(currentMonthStart)
    currentMonthDay.setDate(currentMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_3,
        valueInCents: VALOR_SERVICO_3,
        createdAt: currentMonthDay,
      },
    })
  }

  for (let i = 0; i < 15; i++) {
    const currentMonthDay = new Date(currentMonthStart)
    currentMonthDay.setDate(currentMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_4,
        valueInCents: VALOR_SERVICO_4,
        createdAt: currentMonthDay,
      },
    })
  }

  for (let i = 0; i < 15; i++) {
    const currentMonthDay = new Date(currentMonthStart)
    currentMonthDay.setDate(currentMonthStart.getDate() + i)

    await prisma.providedService.create({
      data: {
        barberId: ID_BARBEIRO,
        clientId: ID_CLIENTE,
        serviceId: ID_SERVICO_5,
        valueInCents: VALOR_SERVICO_5,
        createdAt: currentMonthDay,
      },
    })
  }
}

seed().then(() => {
  console.log('Database seeded')
})
