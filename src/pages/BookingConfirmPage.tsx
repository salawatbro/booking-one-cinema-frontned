import { useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Clock, MapPin, Armchair, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatTime, formatDateFull, formatDuration } from '@/lib/utils';
import { hapticNotification } from '@/lib/haptic';
import { useShowtime, useShowtimeSeats, useCreateBooking } from '@/hooks/useApi';
import { storageUrl } from '@/lib/api';
import { SkeletonBox } from '@/components/Skeleton';
import { useTelegramMainButton } from '@/hooks/useTelegramMainButton';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { WebBackButton } from '@/components/WebBackButton';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { cn } from '@/lib/utils';

export function BookingConfirmPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const selectedSeatIds: number[] = location.state?.selectedSeats || [];

  const { data: showtime, isLoading: showtimeLoading } = useShowtime(Number(showtimeId));
  const { data: seatMap, isLoading: seatsLoading } = useShowtimeSeats(Number(showtimeId));
  const createBooking = useCreateBooking();

  const movie = showtime?.movie;
  const allSeats = seatMap?.rows.flatMap((r) => r.seats) || [];
  const selectedSeats = allSeats.filter((s) => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeats.length * (showtime?.price || 0);

  const isLoading = showtimeLoading || seatsLoading;

  const handleBook = useCallback(() => {
    createBooking.mutate(
      { showtimeId: Number(showtimeId), seatIds: selectedSeatIds },
      {
        onSuccess: (booking) => {
          hapticNotification('success');
          navigate('/payment', { state: { totalPrice, bookingId: booking.id } });
        },
        onError: () => {
          // Fallback: navigate to payment even if API fails (for development)
          hapticNotification('success');
          navigate('/payment', { state: { totalPrice, bookingId: 0 } });
        },
      },
    );
  }, [createBooking, showtimeId, selectedSeatIds, navigate, totalPrice]);

  const isDesktop = useIsDesktop();
  const { isAvailable: hasBackButton } = useTelegramBackButton(() => navigate(-1));
  const { isAvailable: hasMainButton } = useTelegramMainButton({
    text: createBooking.isPending
      ? t('booking.processing')
      : t('booking.bookButton', { price: formatPrice(totalPrice) }),
    onClick: handleBook,
    isLoading: createBooking.isPending,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center border-b border-border" style={{ padding: '0 16px', height: 56 }}>
          <h1 className="text-[15px] font-semibold text-text-primary">{t('booking.confirm')}</h1>
        </div>
        <div style={{ padding: '16px 16px 0' }}>
          <div className="flex gap-3 bg-bg-secondary" style={{ padding: 12, borderRadius: 8 }}>
            <SkeletonBox style={{ width: 70, height: 100, borderRadius: 6 }} />
            <div className="flex flex-col justify-center flex-1" style={{ gap: 8 }}>
              <SkeletonBox style={{ height: 18, width: '70%', borderRadius: 4 }} />
              <SkeletonBox style={{ height: 14, width: '50%', borderRadius: 4 }} />
              <SkeletonBox style={{ height: 14, width: '60%', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ maxWidth: isDesktop ? 640 : undefined, marginLeft: isDesktop ? 'auto' : undefined, marginRight: isDesktop ? 'auto' : undefined }}>
      <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        {!hasBackButton && <WebBackButton />}
        <h1 className="text-[15px] font-semibold text-text-primary">{t('booking.confirm')}</h1>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div className="flex gap-3 bg-bg-secondary" style={{ padding: 12, borderRadius: 8 }}>
          <div className="flex-shrink-0 overflow-hidden bg-bg-secondary" style={{ width: 70, height: 100, borderRadius: 6 }}>
            {movie?.poster_url && <img src={storageUrl(movie.poster_url)!} alt={movie.name} className="h-full w-full object-cover" />}
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

      {createBooking.isError && (
        <div className="bg-danger-light" style={{ margin: '16px 16px 0', padding: '12px 14px', borderRadius: 8 }}>
          <p className="text-[12px] text-danger">Error: {createBooking.error.message}</p>
        </div>
      )}

      {!hasMainButton && (
        <div
          className={cn(
            'bg-bg-card border-t border-border',
            !isDesktop && 'fixed bottom-14 left-0 right-0',
          )}
          style={{ padding: '12px 16px 20px' }}
        >
          <button
            onClick={handleBook}
            disabled={createBooking.isPending}
            className="w-full bg-accent text-white font-semibold text-[15px] disabled:opacity-60"
            style={{ padding: '14px 0', borderRadius: 8 }}
          >
            {createBooking.isPending
              ? t('booking.processing')
              : t('booking.bookButton', { price: formatPrice(totalPrice) })}
          </button>
        </div>
      )}
    </div>
  );
}
