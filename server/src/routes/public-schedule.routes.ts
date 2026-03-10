import type { FastifyInstance } from 'fastify'
import { scheduleController } from '../controllers/schedule.controller'

export async function publicScheduleRoutes(app: FastifyInstance) {
  // Rate limit already applied globally to public routes via app plugin config

  app.get('/week', {
    schema: {
      tags: ['Public - Horários'],
      summary: 'Consultar horários da semana',
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', description: 'Data de início (YYYY-MM-DD). Padrão: semana atual' },
        },
      },
    },
    handler: scheduleController.getWeekSchedule.bind(scheduleController),
  })

  app.get('/day/:date', {
    schema: {
      tags: ['Public - Horários'],
      summary: 'Consultar horários de um dia específico',
      params: {
        type: 'object',
        required: ['date'],
        properties: {
          date: { type: 'string', description: 'Data no formato YYYY-MM-DD' },
        },
      },
    },
    handler: scheduleController.listByDate.bind(scheduleController),
  })
}
