import z from 'zod'

export const envSchema = z.object({
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith('postgresql://'),
})

export const env = envSchema.parse(process.env)
