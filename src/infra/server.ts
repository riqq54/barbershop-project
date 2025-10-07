import { app } from './app.ts'
import { env } from './env/env.ts'

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${env.PORT}`)
})
