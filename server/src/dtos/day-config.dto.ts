import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const setDayStatusDto = z.object({
  date: z.string().regex(dateRegex, { message: 'Data deve estar no formato YYYY-MM-DD' }),
  isClosed: z.boolean(),
  reason: z.string().optional(),
})

export type SetDayStatusDto = z.infer<typeof setDayStatusDto>
