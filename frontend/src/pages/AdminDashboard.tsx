import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/src/hooks/useAuth';
import { useTimeSlots } from '@/src/hooks/useTimeSlots';
import { Calendar } from '@/src/components/Calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Loader2, Settings, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AdminDashboard() {
  const { isLogged } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { slots, isLoading, toggleSlotStatus } = useTimeSlots(selectedDate);

  useEffect(() => {
    if (!isLogged) {
      navigate('/login');
    }
  }, [isLogged, navigate]);

  if (!isLogged) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between pb-8 border-b border-zinc-800/60">
        <div>
          <h1 className="text-4xl font-serif font-medium tracking-tight text-zinc-50">Painel de Controle</h1>
          <p className="text-zinc-400 mt-2 font-light">Gerencie a agenda e os horários de atendimento.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-full shadow-lg">
          <Settings className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <Card className="bg-zinc-900/40 border-zinc-800/60 backdrop-blur-md">
              <CardHeader className="pb-4 border-b border-zinc-800/40">
                <CardTitle className="text-lg font-serif font-medium text-zinc-200">Instruções</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400 space-y-3 pt-6 font-light">
                <p className="flex gap-3"><span className="text-amber-500 font-medium">01</span> Selecione um dia no calendário acima.</p>
                <p className="flex gap-3"><span className="text-amber-500 font-medium">02</span> Clique em um horário para alternar seu status entre Livre e Ocupado.</p>
                <p className="flex gap-3"><span className="text-amber-500 font-medium">03</span> As alterações são salvas automaticamente.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md overflow-hidden min-h-[600px]">
            <CardHeader className="pb-6 border-b border-zinc-800/60 bg-zinc-900/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-serif font-medium text-zinc-100">Gerenciador de Agenda</CardTitle>
                  <CardDescription className="capitalize mt-2 text-zinc-400 text-base">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </CardDescription>
                </div>
                <div className="flex gap-5 text-sm font-medium tracking-wide uppercase">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                    <span className="text-zinc-400">Livre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <span className="text-zinc-500">Ocupado</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-zinc-500">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500/70" />
                  <p className="tracking-wide text-sm uppercase">Sincronizando...</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                  <p className="text-lg font-serif italic">Nenhum horário configurado para este dia.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlotStatus(slot.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950",
                        slot.isOccupied 
                          ? "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700"
                          : "bg-zinc-900 border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800 shadow-lg"
                      )}
                    >
                      <span className={cn(
                        "text-2xl font-medium tracking-wider mb-3 transition-colors",
                        slot.isOccupied ? "text-zinc-600 line-through decoration-zinc-800" : "text-zinc-100 group-hover:text-amber-400"
                      )}>
                        {slot.time}
                      </span>
                      
                      <div className={cn(
                        "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors",
                        slot.isOccupied ? "bg-zinc-900 text-zinc-500" : "bg-amber-500/10 text-amber-500/90 border border-amber-500/20"
                      )}>
                        {slot.isOccupied ? (
                          <><XCircle className="h-3.5 w-3.5" /> Ocupado</>
                        ) : (
                          <><CheckCircle2 className="h-3.5 w-3.5" /> Livre</>
                        )}
                      </div>
                    </button>
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
