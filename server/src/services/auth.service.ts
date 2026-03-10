import bcrypt from 'bcryptjs'
import { prisma } from '../prisma/client'
import { env } from '../config/env'
import type { LoginDto } from '../dtos/auth.dto'
import type { FastifyInstance } from 'fastify'

export class AuthService {
  async ensureAdminExists(): Promise<void> {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10)
      await prisma.user.create({
        data: {
          name: env.ADMIN_NAME,
          email: env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'ADMIN',
        },
      })
      console.log(`✅ Admin padrão criado: ${env.ADMIN_EMAIL}`)
    }
  }

  async login(data: LoginDto, app: FastifyInstance) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })

    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)

    if (!passwordMatch) {
      throw new Error('Credenciais inválidas')
    }

    const token = app.jwt.sign(
      { sub: user.id, role: user.role },
      { expiresIn: '8h' }
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}

export const authService = new AuthService()
