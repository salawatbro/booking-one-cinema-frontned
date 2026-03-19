import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { hapticSelection } from '@/lib/haptic';
import type { SeatMap } from '@/types/api';

interface SeatGridProps {
  seatMap: SeatMap;
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
}

export function SeatGrid({ seatMap, selectedSeats, onToggleSeat }: SeatGridProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '60%', marginBottom: 24 }}>
        <div className="bg-accent" style={{ height: 3, borderRadius: 2, opacity: 0.5 }} />
        <p className="text-center text-[10px] text-text-tertiary uppercase tracking-widest" style={{ marginTop: 6 }}>
          {t('seats.screen')}
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: 6 }}>
        {seatMap.rows.map((row) => (
          <div key={row.row_number} className="flex items-center" style={{ gap: 6 }}>
            <span className="text-[10px] text-text-tertiary font-medium" style={{ width: 18, textAlign: 'right' }}>{row.row_number}</span>
            <div className="flex" style={{ gap: 6 }}>
              {row.seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const label = seat.is_booked
                  ? t('seats.seatBooked', { row: seat.row, number: seat.number })
                  : isSelected
                    ? t('seats.seatSelected', { row: seat.row, number: seat.number })
                    : t('seats.seatLabel', { row: seat.row, number: seat.number });
                return (
                  <button
                    key={seat.id}
                    disabled={seat.is_booked}
                    onClick={() => { hapticSelection(); onToggleSeat(seat.id); }}
                    aria-label={label}
                    className={cn(
                      'flex items-center justify-center text-[10px] font-semibold transition-all',
                      seat.is_booked && 'bg-bg-secondary text-text-tertiary/20 cursor-not-allowed',
                      !seat.is_booked && !isSelected && 'bg-bg-secondary text-text-secondary active:scale-90',
                      isSelected && 'bg-accent text-white scale-105',
                    )}
                    style={{ width: 34, height: 34, borderRadius: 4 }}
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-text-tertiary font-medium" style={{ width: 18 }}>{row.row_number}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-5 text-[11px] text-text-tertiary" style={{ marginTop: 20 }}>
        <div className="flex items-center gap-1.5">
          <div className="bg-bg-secondary" style={{ width: 16, height: 16, borderRadius: 3 }} />
          <span>{t('seats.available')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-accent" style={{ width: 16, height: 16, borderRadius: 3 }} />
          <span>{t('seats.selected')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-bg-secondary" style={{ width: 16, height: 16, borderRadius: 3, opacity: 0.3 }} />
          <span>{t('seats.booked')}</span>
        </div>
      </div>
    </div>
  );
}
