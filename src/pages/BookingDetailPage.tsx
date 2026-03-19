import { useNavigate, useParams } from 'react-router-dom';
import { Clock, MapPin, XCircle, Armchair, CreditCard } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { cn, formatPrice, formatTime, formatDateFull, formatDuration } from '@/lib/utils';
import { useBooking, useCancelBooking } from '@/hooks/useApi';
import { storageUrl } from '@/lib/api';
import { SkeletonBox } from '@/components/Skeleton';
import type { Booking } from '@/types/api';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';

const statusConfig: Record<Booking['status'], { bg: string; text: string; dot: string }> = {
  confirmed: { bg: 'bg-success-light', text: 'text-success', dot: 'bg-success' },
  pending: { bg: 'bg-warning-light', text: 'text-warning', dot: 'bg-warning' },
  cancelled: { bg: 'bg-danger-light', text: 'text-danger', dot: 'bg-danger' },
};

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: booking, isLoading, error } = useBooking(Number(id));
  const cancelBooking = useCancelBooking();

  useTelegramBackButton(() => navigate(-1));

  if (isLoading) {
    return (
      <div style={{ paddingBottom: 80 }}>
        <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
          <SkeletonBox style={{ height: 18, width: 100, borderRadius: 4 }} />
          <div className="ml-auto">
            <SkeletonBox style={{ height: 22, width: 80, borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ padding: '16px 16px 0' }}>
          <div className="flex gap-3 bg-bg-secondary" style={{ padding: 12, borderRadius: 8 }}>
            <SkeletonBox style={{ width: 60, height: 88, borderRadius: 4 }} />
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

  if (error) {
    return (
      <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
        <p className="text-[13px] text-text-tertiary">Error: {error.message}</p>
      </div>
    );
  }

  if (!booking) return <div className="flex h-screen items-center justify-center text-text-secondary">{t('booking.notFound')}</div>;

  const config = statusConfig[booking.status];
  const movie = booking.showtime.movie;

  const handleCancel = () => {
    cancelBooking.mutate(booking.id);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        <h1 className="text-[15px] font-semibold text-text-primary">{t('booking.id', { id: booking.id })}</h1>
        <span className={cn('flex items-center gap-1.5 text-[11px] font-semibold ml-auto', config.bg, config.text)} style={{ padding: '3px 10px', borderRadius: 4 }}>
          <span className={cn('rounded-full', config.dot)} style={{ width: 6, height: 6 }} />
          {t(`status.${booking.status}`)}
        </span>
      </div>

      {booking.ticket_code && (
        <div className="flex flex-col items-center bg-bg-secondary" style={{ padding: '24px 16px' }}>
          <div className="flex items-center justify-center bg-white" style={{ width: 140, height: 140, borderRadius: 8, padding: 10 }}>
            <QRCodeSVG value={JSON.stringify({ ticket: booking.ticket_code, booking_id: booking.id })} size={120} />
          </div>
          <p className="text-[11px] text-text-tertiary" style={{ marginTop: 10 }}>{t('booking.ticketCode')}</p>
          <p className="text-[18px] font-bold text-text-primary tracking-widest" style={{ marginTop: 2 }}>{booking.ticket_code}</p>
        </div>
      )}

      <div style={{ padding: '16px 16px 0' }}>
        <div className="flex gap-3 bg-bg-secondary" style={{ padding: 12, borderRadius: 8 }}>
          <div className="flex-shrink-0 overflow-hidden bg-bg-card" style={{ width: 60, height: 88, borderRadius: 4 }}>
            {movie?.poster_url && <img src={storageUrl(movie.poster_url)!} alt={movie.name} className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-text-primary line-clamp-2">{movie?.name}</h2>
            <div className="flex flex-col text-[12px] text-text-secondary" style={{ marginTop: 6, gap: 3 }}>
              <span className="flex items-center gap-1.5"><Clock size={12} /> {formatDateFull(booking.showtime.start_date)}, {formatTime(booking.showtime.start_time)}</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {booking.showtime.hall?.name}{movie && ` · ${formatDuration(movie.duration)}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 8 }}>
          <Armchair size={14} /> <span>{t('booking.seats', { count: booking.seats.length })}</span>
        </div>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {booking.seats.map((s) => (
            <span key={s.id} className="text-[12px] font-semibold text-text-primary bg-bg-secondary" style={{ padding: '6px 12px', borderRadius: 4 }}>
              {t('booking.row', { row: s.row, number: s.number })}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border" style={{ margin: '16px 16px 0' }} />

      <div style={{ padding: '14px 16px 0' }}>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 8 }}>
          <CreditCard size={14} /> <span>{t('booking.payment')}</span>
        </div>
        <div className="flex justify-between text-[13px]" style={{ marginBottom: 4 }}>
          <span className="text-text-secondary">{t('booking.ticketPrice')}</span>
          <span className="text-text-primary">{formatPrice(booking.showtime.price)}</span>
        </div>
        <div className="flex justify-between text-[13px]" style={{ marginBottom: 4 }}>
          <span className="text-text-secondary">{t('booking.seatsCount')}</span>
          <span className="text-text-primary">x {booking.seats.length}</span>
        </div>
        <div className="border-t border-border" style={{ margin: '8px 0' }} />
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-semibold text-text-primary">{t('booking.total')}</span>
          <span className="text-[18px] font-bold text-accent">{formatPrice(booking.total_price)}</span>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* TODO: enable when download API is ready
        {booking.status === 'confirmed' && (
          <button
            onClick={() => downloadTicket(booking.id).catch(() => {})}
            className="w-full bg-accent text-white text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
            style={{ height: 48, borderRadius: 8 }}
          >
            <Download size={16} /> {t('booking.downloadTicket')}
          </button>
        )}
        */}
        {booking.can_cancel && (
          <button
            onClick={handleCancel}
            disabled={cancelBooking.isPending}
            className="w-full border border-danger text-danger text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-50"
            style={{ height: 48, borderRadius: 8 }}
          >
            <XCircle size={16} /> {cancelBooking.isPending ? t('booking.cancelling') : t('booking.cancel')}
          </button>
        )}
        {cancelBooking.isError && (
          <p className="text-[12px] text-danger text-center">Error: {cancelBooking.error.message}</p>
        )}
      </div>
    </div>
  );
}
