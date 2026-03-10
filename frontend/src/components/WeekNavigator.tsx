import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WeekNavigatorProps {
  startDate: string
  weekOffset: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

function formatWeekRange(startDate: string): string {
  const [y, m, d] = startDate.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  const end = new Date(y, m - 1, d + 6)
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
  }
  return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`
}

export function WeekNavigator({ startDate, weekOffset, onPrev, onNext, onToday }: WeekNavigatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={onPrev} className="h-8 w-8">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext} className="h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <span className="font-display text-lg text-ink">
        {formatWeekRange(startDate)}
      </span>

      {weekOffset !== 0 && (
        <Button variant="ghost" size="sm" onClick={onToday}
          className="text-xs text-ink-500 gap-1.5 h-7">
          <CalendarDays className="w-3.5 h-3.5" />
          Hoje
        </Button>
      )}
    </div>
  )
}
