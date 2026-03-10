import type { FastifyInstance } from 'fastify';
import { dayConfigController } from '../controllers/day-config.controller';
import { scheduleController } from '../controllers/schedule.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

export async function adminRoutes(app: FastifyInstance) {
  // All routes in this plugin require admin auth
  app.addHook('preHandler', requireAdmin);

  // ── Schedules ────────────────────────────────────────────────────────────────

  app.post('/schedules', {
    schema: {
      tags: ['Admin - Horários'],
      summary: 'Criar um horário',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['date', 'startTime', 'endTime'],
        properties: {
          date: { type: 'string' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          status: { type: 'string', enum: ['AVAILABLE', 'BOOKED', 'CLOSED'] },
          label: { type: 'string' },
        },
      },
    },
    handler: scheduleController.createSchedule.bind(scheduleController),
  });

  app.post('/schedules/bulk', {
    schema: {
      tags: ['Admin - Horários'],
      summary: 'Criar múltiplos horários para um dia',
      security: [{ bearerAuth: [] }],
    },
    handler: scheduleController.bulkCreateSchedule.bind(scheduleController),
  });

  app.patch('/schedules/:id/book', {
    schema: {
      tags: ['Admin - Horários'],
      summary: 'Marcar um horário como agendado',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
    },
    handler: scheduleController.bookSchedule.bind(scheduleController),
  });

  app.patch('/schedules/:id', {
    schema: {
      tags: ['Admin - Horários'],
      summary: 'Atualizar um horário (status, label)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
    },
    handler: scheduleController.updateSchedule.bind(scheduleController),
  });

  app.delete('/schedules/:id', {
    schema: {
      tags: ['Admin - Horários'],
      summary: 'Deletar um horário',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
    },
    handler: scheduleController.deleteSchedule.bind(scheduleController),
  });

  // ── Day Config ───────────────────────────────────────────────────────────────

  app.post('/day-config', {
    schema: {
      tags: ['Admin - Configuração de Dias'],
      summary: 'Marcar um dia como aberto ou fechado',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['date', 'isClosed'],
        properties: {
          date: { type: 'string' },
          isClosed: { type: 'boolean' },
          reason: { type: 'string' },
        },
      },
    },
    handler: dayConfigController.setDayStatus.bind(dayConfigController),
  });

  app.get('/day-config/closed', {
    schema: {
      tags: ['Admin - Configuração de Dias'],
      summary: 'Listar todos os dias fechados',
      security: [{ bearerAuth: [] }],
    },
    handler: dayConfigController.listClosedDays.bind(dayConfigController),
  });

  app.get('/day-config/:date', {
    schema: {
      tags: ['Admin - Configuração de Dias'],
      summary: 'Consultar configuração de um dia específico',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['date'],
        properties: { date: { type: 'string' } },
      },
    },
    handler: dayConfigController.getDayStatus.bind(dayConfigController),
  });
}