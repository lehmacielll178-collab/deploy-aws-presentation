import { useState, useEffect, useCallback } from 'react'
import { scheduleService, type DaySchedule } from '@/services/api'

function getMondayOfWeek(offset = 0): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  now.setDate(now.getDate() + diff + offset * 7)
  return now.toISOString().split('T')[0]
}

export function useWeekSchedule() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [data, setData] = useState<DaySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const startDate = getMondayOfWeek(weekOffset)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await scheduleService.getWeek(startDate)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar agenda')
    } finally {
      setLoading(false)
    }
  }, [startDate])

  useEffect(() => { fetch() }, [fetch])

  return {
    data,
    loading,
    error,
    startDate,
    weekOffset,
    prevWeek: () => setWeekOffset((o) => o - 1),
    nextWeek: () => setWeekOffset((o) => o + 1),
    goToday: () => setWeekOffset(0),
    refresh: fetch,
  }
}
