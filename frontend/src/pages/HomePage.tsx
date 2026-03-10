import { Header } from '@/components/Header'
import { WeekNavigator } from '@/components/WeekNavigator'
import { WeekGrid } from '@/components/WeekGrid'
import { useWeekSchedule } from '@/hooks/useWeekSchedule'
import { Scissors, Clock, MapPin } from 'lucide-react'

export function HomePage() {
  const { data, loading, error, startDate, weekOffset, prevWeek, nextWeek, goToday } = useWeekSchedule()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="border-b border-ink-200/60 bg-gradient-to-b from-ink-950 to-ink py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <p className="font-mono text-gold/70 text-xs uppercase tracking-[0.2em] mb-3">
              Agende seu horário
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-cream leading-tight mb-4">
              Barber Shop
            </h1>
            <p className="text-ink-300 font-body text-sm max-w-md leading-relaxed">
              Cortes precisos, ambiente exclusivo. Veja os horários disponíveis e venha nos visitar.
            </p>
          </div>

          <div
            className="flex flex-wrap gap-6 mt-8 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-2 text-ink-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-gold/60" />
              Seg–Sex: 09h–18h · Sáb: 09h–16h
            </div>
            <div className="flex items-center gap-2 text-ink-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-gold/60" />
              Rua das Tesouras, 42
            </div>
            <div className="flex items-center gap-2 text-ink-400 text-xs">
              <Scissors className="w-3.5 h-3.5 text-gold/60" />
              Slots de 15 minutos
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div
          className="flex items-center justify-between mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
        >
          <h2 className="font-display text-2xl text-ink">Agenda da semana</h2>
          <WeekNavigator
            startDate={startDate}
            weekOffset={weekOffset}
            onPrev={prevWeek}
            onNext={nextWeek}
            onToday={goToday}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-5 text-xs text-ink-500">
          {[
            { color: 'bg-white border border-ink-200', label: 'Disponível' },
            { color: 'bg-ink-950 border border-ink-700', label: 'Ocupado' },
            { color: 'bg-gold-50 border border-gold-200', label: 'Almoço' },
            { color: 'bg-ink-100 border border-ink-200', label: 'Fechado' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${color}`} />
              {label}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-ink-200 overflow-hidden">
                <div className="h-16 bg-ink-100 shimmer" />
                <div className="p-2 space-y-1.5">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="h-8 rounded bg-ink-100 shimmer" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-400">
            <Scissors className="w-8 h-8 opacity-30" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
          >
            <WeekGrid days={data} />
          </div>
        )}
      </main>

      <footer className="border-t border-ink-200/60 py-6 text-center">
        <p className="text-xs text-ink-400 font-mono">
          © {new Date().getFullYear()} Barber Shop · Todos os direitos reservados
        </p>
      </footer>
    </div>
  )
}
