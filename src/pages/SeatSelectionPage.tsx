import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, MapPin, Armchair } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SeatGrid } from '@/components/SeatGrid';
import { formatPrice, formatTime, formatDuration } from '@/lib/utils';
import { useShowtime, useShowtimeSeats } from '@/hooks/useApi';
import { storageUrl } from '@/lib/api';
import { SkeletonBox } from '@/components/Skeleton';
import { useTelegramMainButton } from '@/hooks/useTelegramMainButton';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { WebBackButton } from '@/components/WebBackButton';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const { data: showtime, isLoading: showtimeLoading, error: showtimeError } = useShowtime(Number(showtimeId));
  const { data: seatMap, isLoading: seatsLoading, error: seatsError } = useShowtimeSeats(Number(showtimeId));

  const movie = showtime?.movie;
  const totalPrice = selectedSeats.length * (showtime?.price || 0);
  const allSeats = seatMap?.rows.flatMap((r) => r.seats) || [];
  const selected = allSeats.filter((s) => selectedSeats.includes(s.id));

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) => prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]);
  };

  const handleContinue = useCallback(() => {
    navigate(`/booking-confirm/${showtimeId}`, { state: { selectedSeats } });
  }, [navigate, showtimeId, selectedSeats]);

  const isDesktop = useIsDesktop();
  const { isAvailable: hasBackButton } = useTelegramBackButton(() => navigate(-1));
  const { isAvailable: hasMainButton } = useTelegramMainButton({
    text: `${t('seats.continue')} — ${formatPrice(totalPrice)}`,
    onClick: handleContinue,
    visible: selectedSeats.length > 0,
  });

  const isLoading = showtimeLoading || seatsLoading;
  const error = showtimeError || seatsError;

  if (error) {
    return (
      <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
        <p className="text-[13px] text-text-tertiary">Error: {error.message}</p>
      </div>
    );
  }

  // Sidebar with movie info + selected seats + continue button
  const sidebar = (
    <div className="flex flex-col bg-bg-card border border-border" style={{ borderRadius: 8, padding: 20, gap: 16 }}>
      {/* Movie info */}
      {isLoading ? (
        <div className="flex gap-3">
          <SkeletonBox style={{ width: 80, height: 120, borderRadius: 6 }} />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBox style={{ height: 18, width: '80%', borderRadius: 4 }} />
            <SkeletonBox style={{ height: 14, width: '60%', borderRadius: 4 }} />
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          {movie?.poster_url && (
            <div className="flex-shrink-0 overflow-hidden bg-bg-secondary" style={{ width: 80, height: 120, borderRadius: 6 }}>
              <img src={storageUrl(movie.poster_url)!} alt={movie.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h2 className="text-[16px] font-bold text-text-primary line-clamp-2">{movie?.name}</h2>
            <div className="flex flex-col text-[12px] text-text-secondary" style={{ marginTop: 6, gap: 3 }}>
              {showtime && (
                <>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {formatTime(showtime.start_time)}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} /> {showtime.hall?.name}</span>
                  {movie && <span>{formatDuration(movie.duration)}</span>}
                </>
              )}
            </div>
            {showtime && (
              <span className="text-[13px] font-semibold text-accent" style={{ marginTop: 6 }}>
                {formatPrice(showtime.price)}{t('seats.perSeat')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Selected seats */}
      {selectedSeats.length > 0 && (
        <>
          <div className="border-t border-border" />
          <div>
            <div className="flex items-center gap-1.5" style={{ marginBottom: 8 }}>
              <Armchair size={14} className="text-text-tertiary" />
              <span className="text-[12px] font-semibold text-text-secondary">{t('booking.selectedSeats')}</span>
            </div>
            <div className="flex flex-wrap" style={{ gap: 6 }}>
              {selected.map((s) => (
                <span key={s.id} className="text-[11px] font-semibold text-accent bg-accent-light" style={{ padding: '4px 10px', borderRadius: 4 }}>
                  {t('booking.rowShort', { row: s.row, number: s.number })}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-tertiary">{t('seats.seatsSelected', { count: selectedSeats.length })}</p>
              <p className="text-[22px] font-bold text-text-primary">{formatPrice(totalPrice)}</p>
            </div>
          </div>

          {!hasMainButton && (
            <button
              onClick={handleContinue}
              className="w-full bg-accent text-white font-semibold text-[15px]"
              style={{ padding: '14px 0', borderRadius: 8 }}
            >
              {t('seats.continue')}
            </button>
          )}
        </>
      )}
    </div>
  );

  // Desktop layout
  if (isDesktop) {
    return (
      <div style={{ padding: '24px 24px 24px' }}>
        {!hasBackButton && (
          <div style={{ marginBottom: 16 }}>
            <WebBackButton />
          </div>
        )}
        <div className="flex gap-6" style={{ alignItems: 'flex-start' }}>
          {/* Left: Sidebar */}
          <div className="flex-shrink-0" style={{ width: 320, position: 'sticky', top: 80 }}>
            {sidebar}
          </div>
          {/* Right: Seat grid */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col items-center" style={{ padding: '16px 0' }}>
              {seatsLoading ? (
                <div className="flex flex-col items-center gap-3" style={{ padding: '40px 16px' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonBox key={i} style={{ height: 32, width: '80%', borderRadius: 4 }} />
                  ))}
                </div>
              ) : seatMap ? (
                <SeatGrid seatMap={seatMap} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        {!hasBackButton && <WebBackButton />}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <>
              <SkeletonBox style={{ height: 16, width: '60%', borderRadius: 4 }} />
              <SkeletonBox style={{ height: 12, width: '40%', borderRadius: 4, marginTop: 4 }} />
            </>
          ) : (
            <>
              <h1 className="text-[15px] font-semibold text-text-primary truncate">{movie?.name}</h1>
              <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                {showtime && (
                  <>
                    <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(showtime.start_time)}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {showtime.hall?.name}</span>
                    {movie && <span>{formatDuration(movie.duration)}</span>}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {isLoading ? (
          <SkeletonBox style={{ height: 16, width: 80, borderRadius: 4 }} />
        ) : showtime ? (
          <span className="text-[13px] font-semibold text-accent">{formatPrice(showtime.price)}{t('seats.perSeat')}</span>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: '24px 8px' }}>
        {seatsLoading ? (
          <div className="flex flex-col items-center gap-3" style={{ padding: '40px 16px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBox key={i} style={{ height: 32, width: '80%', borderRadius: 4 }} />
            ))}
          </div>
        ) : seatMap ? (
          <SeatGrid seatMap={seatMap} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
        ) : null}
      </div>

      {selectedSeats.length > 0 && !hasMainButton && (
        <div
          className="bg-bg-card border-t border-border fixed left-0 right-0"
          style={{ padding: '12px 16px 20px', bottom: 60 }}
        >
          <div className="flex items-center gap-1.5 flex-wrap" style={{ marginBottom: 10 }}>
            <Armchair size={14} className="text-text-tertiary" />
            {selected.map((s) => (
              <span key={s.id} className="text-[11px] font-semibold text-accent bg-accent-light" style={{ padding: '2px 8px', borderRadius: 4 }}>
                {t('booking.rowShort', { row: s.row, number: s.number })}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-tertiary">{t('seats.seatsSelected', { count: selectedSeats.length })}</p>
              <p className="text-[20px] font-bold text-text-primary">{formatPrice(totalPrice)}</p>
            </div>
            <button
              onClick={handleContinue}
              className="bg-accent text-white font-semibold text-[14px]"
              style={{ padding: '10px 24px', borderRadius: 8 }}
            >
              {t('seats.continue')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
