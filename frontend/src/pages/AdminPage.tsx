import { AdminHeader } from '@/components/AdminHeader';
import { GenerateSlotsModal } from '@/components/GenerateSlotsModal';
import { WeekGrid } from '@/components/WeekGrid';
import { WeekNavigator } from '@/components/WeekNavigator';
import { useAdminSchedule } from '@/hooks/useAdminSchedule';
import { useAuth } from '@/hooks/useAuth';
import { useWeekSchedule } from '@/hooks/useWeekSchedule';
import { type SlotStatus } from '@/services/api';
import { AlertCircle, Scissors } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [generateDate, setGenerateDate] = useState<string | null>(null);

  const { data, loading, error, startDate, weekOffset, prevWeek, nextWeek, goToday, refresh } =
    useWeekSchedule();

  const { loading: actionLoading, updateSlot, bookSlot, deleteSlot, bulkCreate, setDayStatus } =
    useAdminSchedule(refresh);

  const handleLogout = () => {
    logout();
    navigate('/login-admin');
  };

  const handleStatusChange = (id: string, status: SlotStatus) => updateSlot(id, status);
  const handleDelete = (id: string) => deleteSlot(id);
  const handleToggleDay = (date: string, isClosed: boolean) => setDayStatus(date, isClosed);
  const handleGenerateSlots = (date: string) => setGenerateDate(date);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <AdminHeader onLogout={handleLogout} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl text-ink">Agenda da semana</h2>
            <p className="text-xs text-ink-400 mt-0.5">
              Passe o mouse sobre um slot para ver as ações disponíveis
            </p>
          </div>
          <WeekNavigator
            startDate={startDate}
            weekOffset={weekOffset}
            onPrev={prevWeek}
            onNext={nextWeek}
            onToday={goToday}
          />
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
            <AlertCircle className="w-8 h-8 opacity-40" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="animate-fade-up">
            <WeekGrid
              days={data}
              isAdmin
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onToggleDay={handleToggleDay}
              onGenerateSlots={handleGenerateSlots}
              onBookSlot={bookSlot}
            />
          </div>
        )}
      </main>

      <GenerateSlotsModal
        date={generateDate}
        onClose={() => setGenerateDate(null)}
        onGenerate={bulkCreate}
        loading={actionLoading}
      />

      <footer className="border-t border-ink-200/60 py-4 text-center">
        <p className="text-xs text-ink-400 font-mono">
          <Scissors className="w-3 h-3 inline mr-1.5 opacity-50" />
          Barber Shop · Painel Administrativo
        </p>
      </footer>
    </div>
  );
}