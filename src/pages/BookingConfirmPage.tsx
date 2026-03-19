import { useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Clock, MapPin, Armchair, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatTime, formatDateFull, formatDuration } from '@/lib/utils';
import { hapticNotification } from '@/lib/haptic';
import { mockMovies, mockShowtimesByDate, mockSeatMap } from '@/mock/data';
import { useTelegramMainButton } from '@/hooks/useTelegramMainButton';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';

export function BookingConfirmPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const selectedSeatIds: number[] = location.state?.selectedSeats || [];
  const allShowtimes = Object.values(mockShowtimesByDate).flat();
  const showtime = allShowtimes.find((s) => s.id === Number(showtimeId));
  const movie = mockMovies.find((m) => m.id === showtime?.movie_id);
  const allSeats = mockSeatMap.rows.flatMap((r) => r.seats);
  const selectedSeats = allSeats.filter((s) => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeats.length * (showtime?.price || 0);

  const handleBook = useCallback(() => {
    hapticNotification('success');
    navigate('/payment', { state: { totalPrice, bookingId: 43 } });
  }, [navigate, totalPrice]);

  useTelegramBackButton(() => navigate(-1));
  useTelegramMainButton({
    text: t('booking.bookButton', { price: formatPrice(totalPrice) }),
    onClick: handleBook,
  });

  return (
    <div className="min-h-screen">
      <div className="flex items-center border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        <h1 className="text-[15px] font-semibold text-text-primary">{t('booking.confirm')}</h1>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div className="flex gap-3 bg-bg-secondary" style={{ padding: 12, borderRadius: 8 }}>
          <div className="flex-shrink-0 overflow-hidden bg-bg-secondary" style={{ width: 70, height: 100, borderRadius: 6 }}>
            {movie?.poster_url && <img src={movie.poster_url} alt={movie.name} className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-text-primary line-clamp-2">{movie?.name}</h2>
            <div className="flex flex-col text-[12px] text-text-secondary" style={{ marginTop: 8, gap: 4 }}>
              <span className="flex items-center gap-1.5"><Clock size={12} /> {showtime && `${formatDateFull(showtime.start_date)}, ${formatTime(showtime.start_time)}`}</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {showtime?.hall?.name}{movie && ` · ${formatDuration(movie.duration)}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 8 }}>
          <Armchair size={14} /> <span>{t('booking.selectedSeats')}</span>
        </div>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {selectedSeats.map((s) => (
            <span key={s.id} className="text-[12px] font-semibold text-accent bg-accent-light" style={{ padding: '6px 12px', borderRadius: 6 }}>
              {t('booking.row', { row: s.row, number: s.number })}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border" style={{ margin: '16px 16px 0' }} />

      <div style={{ padding: '14px 16px 0' }}>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 10 }}>
          <CreditCard size={14} /> <span>{t('booking.payment')}</span>
        </div>
        <div className="flex justify-between text-[13px]" style={{ marginBottom: 6 }}>
          <span className="text-text-secondary">{t('booking.ticketPrice')}</span>
          <span className="text-text-primary">{formatPrice(showtime?.price || 0)}</span>
        </div>
        <div className="flex justify-between text-[13px]" style={{ marginBottom: 6 }}>
          <span className="text-text-secondary">{t('booking.seatsCount')}</span>
          <span className="text-text-primary">x {selectedSeats.length}</span>
        </div>
        <div className="border-t border-border" style={{ margin: '8px 0' }} />
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-semibold text-text-primary">{t('booking.total')}</span>
          <span className="text-[18px] font-bold text-accent">{formatPrice(totalPrice)}</span>
        </div>
      </div>

    </div>
  );
}
