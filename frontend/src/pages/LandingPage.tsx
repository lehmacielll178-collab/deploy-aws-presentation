import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/src/components/Calendar';
import { useTimeSlots } from '@/src/hooks/useTimeSlots';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function LandingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { slots, isLoading } = useTimeSlots(selectedDate);

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className="text-center space-y-6 py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-zinc-50 relative z-10">
          A arte do <span className="text-amber-500 italic">corte perfeito.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light relative z-10">
          Tradição, precisão e estilo. Escolha o melhor dia e horário para sua próxima experiência.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        <div className="lg:col-span-8">
          <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="pb-6 border-b border-zinc-800/60 bg-zinc-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif font-medium text-zinc-100">Horários Disponíveis</CardTitle>
                  <CardDescription className="capitalize mt-2 text-zinc-400 text-base">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-zinc-500">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500/70" />
                  <p className="tracking-wide text-sm uppercase">Carregando agenda...</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                  <p className="text-lg font-serif italic">Nenhum horário disponível para este dia.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                        slot.isOccupied 
                          ? "bg-zinc-950/50 border-zinc-800/50 text-zinc-600 cursor-not-allowed"
                          : "bg-zinc-900/80 border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800 cursor-pointer shadow-lg hover:shadow-amber-500/5"
                      )}
                    >
                      <span className={cn(
                        "text-xl font-medium tracking-wider",
                        slot.isOccupied ? "line-through decoration-zinc-700" : "text-zinc-100 group-hover:text-amber-400 transition-colors"
                      )}>
                        {slot.time}
                      </span>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                        {slot.isOccupied ? (
                          <><XCircle className="h-3.5 w-3.5 text-zinc-700" /> <span className="text-zinc-600">Ocupado</span></>
                        ) : (
                          <><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/70" /> <span className="text-zinc-400 group-hover:text-amber-500/90 transition-colors">Livre</span></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
