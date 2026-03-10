import type { FastifyRequest, FastifyReply } from 'fastify'
import { scheduleService } from '../services/schedule.service'
import {
  createScheduleDto,
  updateScheduleDto,
  bulkCreateScheduleDto,
  weekQueryDto,
} from '../dtos/schedule.dto'

export class ScheduleController {
  // Public
  async getWeekSchedule(request: FastifyRequest, reply: FastifyReply) {
    const parsed = weekQueryDto.safeParse(request.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const result = await scheduleService.getWeekSchedule(parsed.data.startDate)
      return reply.status(200).send(result)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar horários da semana' })
    }
  }

  // Admin
  async createSchedule(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createScheduleDto.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const result = await scheduleService.createSchedule(parsed.data)
      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(409).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Erro ao criar horário' })
    }
  }

  async bulkCreateSchedule(request: FastifyRequest, reply: FastifyReply) {
    const parsed = bulkCreateScheduleDto.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const result = await scheduleService.bulkCreateSchedule(parsed.data)
      return reply.status(201).send(result)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao criar horários em lote' })
    }
  }

  async updateSchedule(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const parsed = updateScheduleDto.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const result = await scheduleService.updateSchedule(request.params.id, parsed.data)
      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Erro ao atualizar horário' })
    }
  }

  async deleteSchedule(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      await scheduleService.deleteSchedule(request.params.id)
      return reply.status(204).send()
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Erro ao deletar horário' })
    }
  }

  async listByDate(
    request: FastifyRequest<{ Params: { date: string } }>,
    reply: FastifyReply
  ) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(request.params.date)) {
      return reply.status(400).send({ error: 'Data deve estar no formato YYYY-MM-DD' })
    }

    try {
      const result = await scheduleService.listSchedulesByDate(request.params.date)
      return reply.status(200).send(result)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar horários' })
    }
  }
}

export const scheduleController = new ScheduleController()
