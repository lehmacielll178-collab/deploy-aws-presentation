import { prisma } from '../prisma/client'
import type { SetDayStatusDto } from '../dtos/day-config.dto'

export class DayConfigService {
  async setDayStatus(data: SetDayStatusDto) {
    return prisma.dayConfig.upsert({
      where: { date: data.date },
      update: { isClosed: data.isClosed, reason: data.reason ?? null },
      create: { date: data.date, isClosed: data.isClosed, reason: data.reason ?? null },
    })
  }

  async getDayStatus(date: string) {
    const dayConfig = await prisma.dayConfig.findUnique({ where: { date } })
    return dayConfig ?? { date, isClosed: false, reason: null }
  }

  async listClosedDays() {
    return prisma.dayConfig.findMany({
      where: { isClosed: true },
      orderBy: { date: 'asc' },
    })
  }
}

export const dayConfigService = new DayConfigService()
