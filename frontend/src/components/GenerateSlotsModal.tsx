import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { type BulkCreatePayload } from '@/services/api'
import { X } from 'lucide-react'

interface GenerateSlotsModalProps {
  date: string | null
  onClose: () => void
  onGenerate: (payload: BulkCreatePayload) => Promise<void>
  loading?: boolean
}

function generateSlots(start: string, end: string, intervalMin: number) {
  const slots: { startTime: string; endTime: string }[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let cur = sh * 60 + sm
  const endMin = eh * 60 + em

  while (cur + intervalMin <= endMin) {
    const s = `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`
    const e = `${String(Math.floor((cur + intervalMin) / 60)).padStart(2, '0')}:${String((cur + intervalMin) % 60).padStart(2, '0')}`
    slots.push({ startTime: s, endTime: e })
    cur += intervalMin
  }
  return slots
}

export function GenerateSlotsModal({ date, onClose, onGenerate, loading }: GenerateSlotsModalProps) {
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('18:00')
  const [interval] = useState(15)

  const preview = date ? generateSlots(start, end, interval) : []

  const handleGenerate = async () => {
    if (!date) return
    await onGenerate({ date, slots: preview })
    onClose()
  }

  return (
    <Dialog.Root open={!!date} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-cream border border-ink-200 rounded-lg shadow-2xl p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="font-display text-xl text-ink">
              Gerar Horários
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-ink-400">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </div>

          <p className="text-xs font-mono text-ink-400 mb-4">{date}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label htmlFor="start">Início</Label>
              <Input id="start" type="time" value={start}
                onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">Fim</Label>
              <Input id="end" type="time" value={end}
                onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="bg-ink-50 rounded border border-ink-200 p-3 mb-5">
            <p className="text-xs text-ink-500 mb-2 font-mono">
              {preview.length} slots de 15 min serão criados
            </p>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {preview.map((s) => (
                <span key={s.startTime}
                  className="text-[10px] font-mono bg-white border border-ink-200 rounded px-1.5 py-0.5 text-ink-600">
                  {s.startTime}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.Close>
            <Button variant="gold" onClick={handleGenerate} disabled={loading || preview.length === 0}>
              {loading ? 'Gerando...' : `Criar ${preview.length} slots`}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
