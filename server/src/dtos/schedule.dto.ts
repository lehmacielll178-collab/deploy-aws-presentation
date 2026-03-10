import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const createScheduleDto = z.object({
  date: z.string().regex(dateRegex, { message: 'Data deve estar no formato YYYY-MM-DD' }),
  startTime: z.string().regex(timeRegex, { message: 'Horário inicial deve estar no formato HH:MM' }),
  endTime: z.string().regex(timeRegex, { message: 'Horário final deve estar no formato HH:MM' }),
  status: z.enum(['AVAILABLE', 'BOOKED', 'CLOSED']).default('AVAILABLE'),
  label: z.string().optional(),
})

export type CreateScheduleDto = z.infer<typeof createScheduleDto>

export const updateScheduleDto = z.object({
  status: z.enum(['AVAILABLE', 'BOOKED', 'CLOSED']).optional(),
  label: z.string().optional(),
  startTime: z.string().regex(timeRegex, { message: 'Horário inicial deve estar no formato HH:MM' }).optional(),
  endTime: z.string().regex(timeRegex, { message: 'Horário final deve estar no formato HH:MM' }).optional(),
})

export type UpdateScheduleDto = z.infer<typeof updateScheduleDto>

export const bulkCreateScheduleDto = z.object({
  date: z.string().regex(dateRegex, { message: 'Data deve estar no formato YYYY-MM-DD' }),
  slots: z.array(
    z.object({
      startTime: z.string().regex(timeRegex, { message: 'Horário inicial deve estar no formato HH:MM' }),
      endTime: z.string().regex(timeRegex, { message: 'Horário final deve estar no formato HH:MM' }),
      status: z.enum(['AVAILABLE', 'BOOKED', 'CLOSED']).default('AVAILABLE'),
      label: z.string().optional(),
    })
  ).min(1, { message: 'Deve haver ao menos um horário' }),
})

export type BulkCreateScheduleDto = z.infer<typeof bulkCreateScheduleDto>

export const weekQueryDto = z.object({
  startDate: z.string().regex(dateRegex, { message: 'Data de início deve estar no formato YYYY-MM-DD' }).optional(),
})

export type WeekQueryDto = z.infer<typeof weekQueryDto>
