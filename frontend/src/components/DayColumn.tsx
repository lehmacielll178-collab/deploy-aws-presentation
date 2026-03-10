import { BookingModal } from '@/components/BookingModal';
import { SlotCard } from '@/components/SlotCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type DaySchedule, type SlotStatus } from '@/services/api';
import { CalendarX, Coffee, MessageCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const isLunch = (slot: { startTime: string; endTime: string; label: string | null; }) =>
  slot.label === 'Horário de almoço' || (slot.startTime >= '12:00' && slot.endTime <= '13:00');

interface DayColumnProps {
  day: DaySchedule;
  isAdmin?: boolean;
  isToday?: boolean;
  onStatusChange?: (id: string, status: SlotStatus) => void;
  onDelete?: (id: string) => void;
  onToggleDay?: (date: string, isClosed: boolean) => void;
  onGenerateSlots?: (date: string) => void;
}

export function DayColumn({
  day, isAdmin, isToday,
  onStatusChange, onDelete, onToggleDay, onGenerateSlots,
}: DayColumnProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const date = parseLocalDate(day.date);
  const dayName = DAY_NAMES[date.getDay()];
  const dayNum = date.getDate();
  const monthName = MONTH_NAMES[date.getMonth()];

  const availableSlots = day.slots.filter((s) => s.status === 'AVAILABLE');
  const bookedCount = day.slots.filter((s) => s.status === 'BOOKED').length;
  const lunchSlot = day.slots.find(isLunch);
  const hasAvailable = availableSlots.length > 0;

  return (
    <>
      <div className={cn(
        'flex flex-col min-w-[140px] flex-1 rounded-lg border overflow-hidden',
        isToday ? 'border-gold/50 shadow-[0_0_0_1px_rgba(201,168,76,0.2)]' : 'border-ink-200',
        day.isClosed ? 'opacity-60' : ''
      )}>
        {/* Day header */}
        <div className={cn(
          'px-3 py-2.5 border-b',
          isToday ? 'bg-ink text-cream border-ink-700' : 'bg-ink-50 text-ink border-ink-200'
        )}>
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className={cn(
                'text-[10px] font-mono uppercase tracking-widest',
                isToday ? 'text-gold' : 'text-ink-400'
              )}>
                {dayName}
              </p>
              <p className={cn(
                'font-display text-2xl leading-tight',
                isToday ? 'text-cream' : 'text-ink'
              )}>
                {dayNum}
              </p>
              <p className={cn(
                'text-[10px] font-mono',
                isToday ? 'text-cream/50' : 'text-ink-400'
              )}>
                {monthName}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              {day.isClosed ? (
                <Badge variant="dayclosed" className="text-[9px]">Fechado</Badge>
              ) : hasAvailable ? (
                <span className={cn(
                  'text-[10px] font-mono',
                  isToday ? 'text-gold/80' : 'text-ink-400'
                )}>
                  {availableSlots.length} livre{availableSlots.length !== 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-2 flex flex-col gap-1.5 min-h-[200px]">
          {day.isClosed ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-ink-300">
              <CalendarX className="w-6 h-6" />
              <span className="text-xs text-center">{day.closedReason ?? 'Dia fechado'}</span>
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-xs mt-1"
                  onClick={() => onToggleDay?.(day.date, false)}>
                  Reabrir
                </Button>
              )}
            </div>

          ) : day.slots.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-ink-300">
              <span className="text-xs">Sem horários</span>
              {isAdmin && (
                <Button variant="ghost" size="sm"
                  className="text-xs mt-1 text-gold hover:text-gold-600"
                  onClick={() => onGenerateSlots?.(day.date)}>
                  <PlusCircle className="w-3 h-3" />
                  Gerar
                </Button>
              )}
            </div>

          ) : (
            <>
              {/* ── Aggregated summary card (public view) ── */}
              {!isAdmin && (
                <div className={cn(
                  'rounded border px-3 py-2.5 flex flex-col gap-2',
                  hasAvailable
                    ? 'bg-white border-ink-200'
                    : 'bg-ink-50 border-ink-200 opacity-70'
                )}>
                  {/* Available row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Livres</span>
                    <span className={cn(
                      'text-sm font-mono font-medium',
                      hasAvailable ? 'text-emerald-600' : 'text-ink-400'
                    )}>
                      {availableSlots.length}
                    </span>
                  </div>

                  {/* Booked row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Ocupados</span>
                    <span className="text-sm font-mono font-medium text-ink-500">{bookedCount}</span>
                  </div>

                  {/* Lunch row */}
                  {lunchSlot && (
                    <div className="flex items-center gap-1.5 pt-0.5 border-t border-gold-100">
                      <Coffee className="w-3 h-3 text-gold-500 shrink-0" />
                      <span className="text-[10px] text-gold-600 font-mono">
                        Almoço {lunchSlot.startTime}–{lunchSlot.endTime}
                      </span>
                    </div>
                  )}

                  {/* Book button */}
                  {hasAvailable && (
                    <Button
                      variant="gold"
                      size="sm"
                      className="w-full mt-0.5 gap-1.5 text-xs h-8"
                      onClick={() => setBookingOpen(true)}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Agendar
                    </Button>
                  )}

                  {!hasAvailable && (
                    <p className="text-[10px] text-center text-ink-400 font-mono pt-0.5">
                      Sem horários livres
                    </p>
                  )}
                </div>
              )}

              {/* ── Admin: full slot list ── */}
              {isAdmin && (
                <>
                  {day.slots.map((slot) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      isAdmin
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  ))}
                  <Button variant="ghost" size="sm"
                    className="mt-1 text-xs text-ink-400 hover:text-ink w-full"
                    onClick={() => onGenerateSlots?.(day.date)}>
                    <PlusCircle className="w-3 h-3" />
                    Adicionar slots
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Admin footer */}
        {isAdmin && !day.isClosed && (
          <div className="border-t border-ink-100 bg-ink-50 px-2 py-1.5">
            <Button variant="ghost" size="sm"
              className="w-full text-[10px] text-ink-400 hover:text-red-600 hover:bg-red-50 h-6"
              onClick={() => onToggleDay?.(day.date, true)}>
              Fechar dia
            </Button>
          </div>
        )}
      </div>

      {/* Booking modal — only for public view */}
      {!isAdmin && (
        <BookingModal
          date={bookingOpen ? day.date : null}
          slots={day.slots}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </>
  );
}