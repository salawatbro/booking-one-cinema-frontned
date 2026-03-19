import { cn } from '@/lib/utils';
import { getDayName, getDayNumber, getMonthName } from '@/lib/utils';

interface DatePickerProps {
  dates: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
}

export function DatePicker({ dates, selectedDate, onSelect }: DatePickerProps) {
  const datesByMonth: Record<string, string[]> = {};
  dates.forEach((d) => {
    const month = getMonthName(d);
    if (!datesByMonth[month]) datesByMonth[month] = [];
    datesByMonth[month].push(d);
  });

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{ padding: '12px 16px' }}>
      {Object.entries(datesByMonth).map(([month, monthDates]) => (
        <div key={month} className="flex gap-1 flex-shrink-0">
          <div
            className="flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-text-secondary"
            style={{ width: 44, padding: '10px 0' }}
          >
            <span style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              {month}
            </span>
          </div>
          {monthDates.map((date) => {
            const isActive = selectedDate === date;
            return (
              <button
                key={date}
                onClick={() => onSelect(date)}
                className={cn(
                  'flex flex-shrink-0 flex-col items-center border transition-colors',
                  isActive ? 'bg-accent text-white border-accent' : 'bg-bg-card text-text-primary border-border',
                )}
                style={{ width: 50, padding: '8px 0', borderRadius: 8 }}
              >
                <span className={cn('text-[10px] font-medium', isActive ? 'text-white/70' : 'text-text-tertiary')}>
                  {getDayName(date)}
                </span>
                <span className="text-[17px] font-bold" style={{ marginTop: 2 }}>
                  {getDayNumber(date)}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
