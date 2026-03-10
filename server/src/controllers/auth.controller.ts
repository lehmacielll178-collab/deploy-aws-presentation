import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { authService } from '../services/auth.service'
import { loginDto } from '../dtos/auth.dto'

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const parsed = loginDto.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const app = request.server as FastifyInstance
      const result = await authService.login(parsed.data, app)
      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(401).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({ user: request.user })
  }
}

export const authController = new AuthController()
