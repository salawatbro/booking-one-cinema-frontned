import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, MapPin, Armchair } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn, formatPrice, formatTime, formatDate } from '@/lib/utils';
import type { Booking } from '@/types/api';

const statusConfig: Record<Booking['status'], { bg: string; text: string; dot: string }> = {
  confirmed: { bg: 'bg-success-light', text: 'text-success', dot: 'bg-success' },
  pending: { bg: 'bg-warning-light', text: 'text-warning', dot: 'bg-warning' },
  cancelled: { bg: 'bg-danger-light', text: 'text-danger', dot: 'bg-danger' },
};

export function BookingCard({ booking }: { booking: Booking }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const config = statusConfig[booking.status];

  return (
    <button
      onClick={() => navigate(`/bookings/${booking.id}`)}
      className="w-full text-left bg-bg-secondary active:opacity-70 transition-opacity"
      style={{ padding: 12, borderRadius: 8, marginBottom: 8 }}
    >
      {/* Top: status + price */}
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <span
          className={cn('flex items-center gap-1.5 text-[11px] font-semibold', config.bg, config.text)}
          style={{ padding: '3px 8px', borderRadius: 4 }}
        >
          <span className={cn('rounded-full', config.dot)} style={{ width: 6, height: 6 }} />
          {t(`status.${booking.status}`)}
        </span>
        <span className="text-[14px] font-bold text-text-primary">{formatPrice(booking.total_price)}</span>
      </div>

      {/* Movie info */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 overflow-hidden bg-bg-card" style={{ width: 52, height: 76, borderRadius: 4 }}>
          {booking.showtime.movie?.poster_url ? (
            <img src={booking.showtime.movie.poster_url} alt={booking.showtime.movie.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-tertiary text-[9px]">?</div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-text-primary line-clamp-1">{booking.showtime.movie?.name}</h3>
          <div className="flex flex-col text-[11px] text-text-tertiary" style={{ marginTop: 6, gap: 3 }}>
            <span className="flex items-center gap-1.5">
              <Clock size={11} /> {formatDate(booking.showtime.start_date)}, {formatTime(booking.showtime.start_time)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} /> {booking.showtime.hall?.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Armchair size={11} /> {t('booking.seats', { count: booking.seats.length })}
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="self-center text-text-tertiary flex-shrink-0" />
      </div>

      {/* Ticket code */}
      {booking.ticket_code && (
        <div
          className="flex items-center justify-between border-t border-border"
          style={{ marginTop: 10, paddingTop: 8 }}
        >
          <span className="text-[11px] text-text-tertiary">{t('booking.ticketCode')}</span>
          <span className="text-[12px] font-bold text-text-primary tracking-wider">{booking.ticket_code}</span>
        </div>
      )}
    </button>
  );
}
