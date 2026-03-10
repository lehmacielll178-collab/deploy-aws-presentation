import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Slot } from '@/services/api';
import * as Dialog from '@radix-ui/react-dialog';
import { CalendarCheck, Clock, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '';

interface BookingModalProps {
  date: string | null;
  slots: Slot[];
  onClose: () => void;
  /** Admin mode: confirm fires this instead of opening WhatsApp */
  onBook?: (slotId: string) => Promise<void>;
}

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAY_NAMES[date.getDay()]}, ${d} de ${MONTH_NAMES[m - 1]}`;
}

function buildWhatsAppUrl(date: string, slot: Slot): string {
  const formattedDate = formatDate(date);
  const message = `Olá! Gostaria de agendar um horário na Barber Shop.\n\n📅 ${formattedDate}\n🕐 ${slot.startTime} – ${slot.endTime}\n\nPoderia confirmar a disponibilidade?`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function BookingModal({ date, slots, onClose, onBook }: BookingModalProps) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const [confirming, setConfirming] = useState(false);

  const isAdmin = !!onBook;
  const available = slots.filter((s) => s.status === 'AVAILABLE');

  const handleConfirm = async () => {
    if (!selected || !date) return;
    if (isAdmin) {
      setConfirming(true);
      await onBook(selected.id);
      setConfirming(false);
      setSelected(null);
      onClose();
    } else {
      window.open(buildWhatsAppUrl(date, selected), '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelected(null);
      onClose();
    }
  };

  return (
    <Dialog.Root open={!!date} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-cream border border-ink-200 rounded-lg shadow-2xl p-6 animate-fade-up">

          <div className="flex items-center justify-between mb-1">
            <Dialog.Title className="font-display text-xl text-ink">
              {isAdmin ? 'Marcar como agendado' : 'Agendar horário'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-ink-400">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </div>

          {date && (
            <p className="text-xs text-ink-400 font-mono mb-5">{formatDate(date)}</p>
          )}

          <p className="text-xs text-ink-500 mb-3 uppercase tracking-wider font-mono">
            Horários disponíveis
          </p>

          <div className="grid grid-cols-3 gap-2 mb-6 max-h-52 overflow-y-auto pr-0.5">
            {available.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelected(slot)}
                className={cn(
                  'flex items-center justify-center gap-1 py-2.5 rounded border text-xs font-mono transition-all duration-150',
                  selected?.id === slot.id
                    ? 'bg-ink text-cream border-ink shadow-sm'
                    : 'bg-white border-ink-200 text-ink hover:border-gold hover:bg-gold-50 hover:text-gold-700'
                )}
              >
                <Clock className={cn('w-3 h-3 shrink-0', selected?.id === slot.id ? 'text-gold' : 'text-ink-400')} />
                {slot.startTime}
              </button>
            ))}
          </div>

          {selected && (
            <div className="bg-ink-50 border border-ink-200 rounded px-3 py-2.5 mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-xs text-ink-600">
                Selecionado: <span className="font-mono font-medium text-ink">{selected.startTime} – {selected.endTime}</span>
              </span>
            </div>
          )}

          <Button
            variant={isAdmin ? 'default' : 'gold'}
            className="w-full gap-2"
            disabled={!selected || confirming}
            onClick={handleConfirm}
          >
            {isAdmin
              ? <><CalendarCheck className="w-4 h-4" />{confirming ? 'Salvando...' : 'Confirmar agendamento'}</>
              : <><MessageCircle className="w-4 h-4" />Enviar mensagem no WhatsApp</>
            }
          </Button>

          {!isAdmin && (
            <p className="text-center text-[10px] text-ink-400 mt-3">
              Você será redirecionado para o WhatsApp para confirmar o agendamento.
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}