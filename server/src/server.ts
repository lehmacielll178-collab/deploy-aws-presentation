import { buildApp } from './app'
import { env } from './config/env'
import { authService } from './services/auth.service'
import { prisma } from './prisma/client'

async function main() {
  const app = await buildApp()

  try {
    // Connect to database
    await prisma.$connect()
    app.log.info('✅ Conectado ao banco de dados')

    // Ensure default admin exists
    await authService.ensureAdminExists()

    // Start server
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    app.log.info(`🚀 Servidor rodando na porta ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
