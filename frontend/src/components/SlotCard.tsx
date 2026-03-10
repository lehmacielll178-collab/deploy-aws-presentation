import { type Slot, type SlotStatus } from '@/services/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<SlotStatus, string> = {
  AVAILABLE: 'Disponível',
  BOOKED: 'Ocupado',
  CLOSED: 'Fechado',
}

const STATUS_BADGE: Record<SlotStatus, 'available' | 'booked' | 'closed' | 'lunch'> = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  CLOSED: 'closed',
}

interface SlotCardProps {
  slot: Slot
  isAdmin?: boolean
  onStatusChange?: (id: string, status: SlotStatus) => void
  onDelete?: (id: string) => void
}

const isLunch = (slot: Slot) =>
  slot.label === 'Horário de almoço' || (slot.startTime >= '12:00' && slot.endTime <= '13:00')

export function SlotCard({ slot, isAdmin, onStatusChange, onDelete }: SlotCardProps) {
  const lunch = isLunch(slot)
  const badgeVariant = lunch ? 'lunch' : STATUS_BADGE[slot.status]

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded border transition-all duration-150',
        lunch
          ? 'bg-gold-50 border-gold-200'
          : slot.status === 'AVAILABLE'
          ? 'bg-white border-ink-200 hover:border-ink-400'
          : slot.status === 'BOOKED'
          ? 'bg-ink-950 border-ink-700'
          : 'bg-ink-50 border-ink-200 opacity-60'
      )}
    >
      {/* Time */}
      <span className={cn(
        'font-mono text-xs tabular-nums w-11 shrink-0',
        slot.status === 'BOOKED' ? 'text-cream/60' : lunch ? 'text-gold-600' : 'text-ink-500'
      )}>
        {slot.startTime}
      </span>

      {/* Label or status */}
      <div className="flex-1 min-w-0">
        {lunch ? (
          <span className="flex items-center gap-1.5 text-xs text-gold-700 font-medium">
            <Coffee className="w-3 h-3 shrink-0" />
            Almoço
          </span>
        ) : slot.label ? (
          <span className={cn(
            'text-xs truncate',
            slot.status === 'BOOKED' ? 'text-cream/50' : 'text-ink-500'
          )}>
            {slot.label}
          </span>
        ) : null}
      </div>

      {/* Badge */}
      {!lunch && (
        <Badge variant={badgeVariant} className="shrink-0 text-[10px]">
          {STATUS_LABEL[slot.status]}
        </Badge>
      )}

      {/* Admin controls */}
      {isAdmin && !lunch && (
        <div className="hidden group-hover:flex items-center gap-1 ml-1">
          {slot.status === 'AVAILABLE' && (
            <Button
              variant="ghost" size="sm"
              className="h-6 px-2 text-[10px] text-ink-500 hover:text-ink"
              onClick={() => onStatusChange?.(slot.id, 'BOOKED')}
            >
              Ocupar
            </Button>
          )}
          {slot.status === 'BOOKED' && (
            <Button
              variant="ghost" size="sm"
              className="h-6 px-2 text-[10px] text-cream/60 hover:text-cream hover:bg-ink-800"
              onClick={() => onStatusChange?.(slot.id, 'AVAILABLE')}
            >
              Liberar
            </Button>
          )}
          <Button
            variant="ghost" size="icon"
            className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-950"
            onClick={() => onDelete?.(slot.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
