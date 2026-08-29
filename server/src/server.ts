import Fastify from 'fastify'
import cors from '@fastify/cors'
import { projectRoutes } from './routes/projects.js'

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: 'http://localhost:5173',
})

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'devtrack-api',
  }
})

await app.register(projectRoutes)

const port = 3000

try {
  await app.listen({
    port,
    host: '0.0.0.0',
  })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}