import { type DaySchedule, type SlotStatus } from '@/services/api'
import { DayColumn } from '@/components/DayColumn'

function getTodayStr() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

interface WeekGridProps {
  days: DaySchedule[]
  isAdmin?: boolean
  onStatusChange?: (id: string, status: SlotStatus) => void
  onDelete?: (id: string) => void
  onToggleDay?: (date: string, isClosed: boolean) => void
  onGenerateSlots?: (date: string) => void
}

export function WeekGrid({ days, isAdmin, onStatusChange, onDelete, onToggleDay, onGenerateSlots }: WeekGridProps) {
  const today = getTodayStr()

  return (
    <div className="flex gap-2 overflow-x-auto pb-4">
      {days.map((day) => (
        <DayColumn
          key={day.date}
          day={day}
          isAdmin={isAdmin}
          isToday={day.date === today}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onToggleDay={onToggleDay}
          onGenerateSlots={onGenerateSlots}
        />
      ))}
    </div>
  )
}
