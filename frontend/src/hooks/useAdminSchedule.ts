import { useState, useCallback } from 'react'
import { adminService, type SlotStatus, type BulkCreatePayload } from '@/services/api'

export function useAdminSchedule(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setLoading(true)
    setError(null)
    try {
      await fn()
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  const updateSlot = (id: string, status: SlotStatus) =>
    run(() => adminService.updateSlot(id, { status }))

  const deleteSlot = (id: string) =>
    run(() => adminService.deleteSlot(id))

  const bulkCreate = (data: BulkCreatePayload) =>
    run(() => adminService.bulkCreate(data))

  const setDayStatus = (date: string, isClosed: boolean, reason?: string) =>
    run(() => adminService.setDayStatus(date, isClosed, reason))

  return { loading, error, updateSlot, deleteSlot, bulkCreate, setDayStatus }
}
