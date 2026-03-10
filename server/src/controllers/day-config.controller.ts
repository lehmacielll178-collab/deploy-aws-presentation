import type { FastifyRequest, FastifyReply } from 'fastify'
import { dayConfigService } from '../services/day-config.service'
import { setDayStatusDto } from '../dtos/day-config.dto'

export class DayConfigController {
  async setDayStatus(request: FastifyRequest, reply: FastifyReply) {
    const parsed = setDayStatusDto.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const result = await dayConfigService.setDayStatus(parsed.data)
      return reply.status(200).send(result)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao configurar dia' })
    }
  }

  async getDayStatus(
    request: FastifyRequest<{ Params: { date: string } }>,
    reply: FastifyReply
  ) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(request.params.date)) {
      return reply.status(400).send({ error: 'Data deve estar no formato YYYY-MM-DD' })
    }

    try {
      const result = await dayConfigService.getDayStatus(request.params.date)
      return reply.status(200).send(result)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar status do dia' })
    }
  }

  async listClosedDays(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await dayConfigService.listClosedDays()
      return reply.status(200).send(result)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar dias fechados' })
    }
  }
}

export const dayConfigController = new DayConfigController()
