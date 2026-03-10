import type {
  BulkCreateScheduleDto,
  CreateScheduleDto,
  UpdateScheduleDto,
} from '../dtos/schedule.dto';
import { prisma } from '../prisma/client';

// ── Lunch break config ────────────────────────────────────────────────────────
const LUNCH_START = '12:00';
const LUNCH_END = '13:00';
const LUNCH_LABEL = 'Horário de almoço';

function isLunchTime(startTime: string, endTime: string): boolean {
  return startTime >= LUNCH_START && endTime <= LUNCH_END;
}

function applyLunchBlock<T extends { startTime: string; endTime: string; status: string; label: string | null; }>(
  slot: T
): T {
  if (isLunchTime(slot.startTime, slot.endTime)) {
    return { ...slot, status: 'CLOSED', label: LUNCH_LABEL };
  }
  return slot;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getWeekDates(startDate?: string): string[] {
  const start = startDate ? new Date(startDate + 'T00:00:00') : new Date();
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// ── Service ───────────────────────────────────────────────────────────────────
export class ScheduleService {
  async getWeekSchedule(startDate?: string) {
    const weekDates = getWeekDates(startDate);

    const [schedules, dayConfigs] = await Promise.all([
      prisma.schedule.findMany({
        where: { date: { in: weekDates } },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      }),
      prisma.dayConfig.findMany({
        where: { date: { in: weekDates } },
      }),
    ]);

    const dayConfigMap = new Map(dayConfigs.map((dc) => [dc.date, dc]));

    return weekDates.map((date) => {
      const dayConfig = dayConfigMap.get(date);
      const daySchedules = schedules.filter((s) => s.date === date);

      return {
        date,
        isClosed: dayConfig?.isClosed ?? false,
        closedReason: dayConfig?.reason ?? null,
        slots: daySchedules.map((s) =>
          applyLunchBlock({
            id: s.id,
            startTime: s.startTime,
            endTime: s.endTime,
            status: s.status,
            label: s.label,
          })
        ),
      };
    });
  }

  async createSchedule(data: CreateScheduleDto) {
    const existing = await prisma.schedule.findUnique({
      where: { date_startTime: { date: data.date, startTime: data.startTime } },
    });

    if (existing) {
      throw new Error(`Já existe um horário em ${data.date} às ${data.startTime}`);
    }

    const payload = isLunchTime(data.startTime, data.endTime)
      ? { ...data, status: 'CLOSED' as const, label: LUNCH_LABEL }
      : data;

    return prisma.schedule.create({ data: payload });
  }

  async bulkCreateSchedule(data: BulkCreateScheduleDto) {
    const results = [];
    const errors = [];

    for (const slot of data.slots) {
      try {
        const existing = await prisma.schedule.findUnique({
          where: { date_startTime: { date: data.date, startTime: slot.startTime } },
        });

        if (existing) {
          errors.push(`Horário ${slot.startTime} em ${data.date} já existe`);
          continue;
        }

        const payload = isLunchTime(slot.startTime, slot.endTime)
          ? { ...slot, status: 'CLOSED' as const, label: LUNCH_LABEL }
          : slot;

        const created = await prisma.schedule.create({
          data: { date: data.date, ...payload },
        });
        results.push(created);
      } catch {
        errors.push(`Erro ao criar horário ${slot.startTime}`);
      }
    }

    return { created: results, errors };
  }

  async updateSchedule(id: string, data: UpdateScheduleDto) {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      throw new Error('Horário não encontrado');
    }

    // If the stored slot falls within lunch time, status cannot be changed
    if (isLunchTime(schedule.startTime, schedule.endTime) && data.status && data.status !== 'CLOSED') {
      throw new Error('Horários do almoço não podem ter o status alterado');
    }

    return prisma.schedule.update({ where: { id }, data });
  }

  async deleteSchedule(id: string) {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      throw new Error('Horário não encontrado');
    }

    return prisma.schedule.delete({ where: { id } });
  }

  async getScheduleById(id: string) {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      throw new Error('Horário não encontrado');
    }

    return schedule;
  }

  async listSchedulesByDate(date: string) {
    const schedules = await prisma.schedule.findMany({
      where: { date },
      orderBy: { startTime: 'asc' },
    });

    return schedules.map(applyLunchBlock);
  }
}

export const scheduleService = new ScheduleService();