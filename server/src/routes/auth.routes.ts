import type { FastifyInstance } from 'fastify'
import { authController } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Login do administrador',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
    handler: authController.login.bind(authController),
  })

  app.get('/me', {
    schema: {
      tags: ['Auth'],
      summary: 'Dados do usuário autenticado',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
    handler: authController.me.bind(authController),
  })
}
