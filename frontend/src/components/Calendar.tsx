import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={prevMonth} className="h-10 w-10 rounded-full border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-serif font-medium capitalize tracking-wide text-zinc-100">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-10 w-10 rounded-full border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-xs tracking-widest uppercase text-zinc-500 py-2">
          {format(addDays(startDate, i), 'EEEEE', { locale: ptBR })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "p-1 flex items-center justify-center h-11 w-11 mx-auto rounded-full cursor-pointer transition-all duration-200 text-sm",
              !isCurrentMonth ? "text-zinc-700 pointer-events-none" : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50",
              isSelected && "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            )}
            onClick={() => onSelectDate(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/60 shadow-xl backdrop-blur-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
