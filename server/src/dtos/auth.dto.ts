import { z } from 'zod'

export const loginDto = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
})

export type LoginDto = z.infer<typeof loginDto>

export const loginResponseDto = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
  }),
})

export type LoginResponseDto = z.infer<typeof loginResponseDto>
