import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDuration, formatPrice, formatTime } from '@/lib/utils';
import { useMovie } from '@/hooks/useApi';
import { storageUrl } from '@/lib/api';
import { SkeletonBox } from '@/components/Skeleton';
import { DatePicker } from '@/components/DatePicker';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';

export function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading, error } = useMovie(Number(id));
  const [selectedDate, setSelectedDate] = useState('');

  const movie = data?.movie;
  const showtimesByDate = data?.showtimesByDate || {};
  const movieDates = Object.keys(showtimesByDate);

  useEffect(() => {
    if (movieDates.length > 0 && !selectedDate) {
      setSelectedDate(movieDates[0]);
    }
  }, [movieDates, selectedDate]);

  useTelegramBackButton(() => navigate(-1));

  if (isLoading) {
    return (
      <div style={{ paddingBottom: 80 }}>
        <div className="relative aspect-[3/4] max-h-[50vh] w-full">
          <SkeletonBox className="h-full w-full" />
        </div>
        <div className="-mt-16 relative" style={{ padding: '0 16px' }}>
          <SkeletonBox style={{ height: 24, width: '70%', borderRadius: 4 }} />
          <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
            <SkeletonBox style={{ height: 24, width: 80, borderRadius: 4 }} />
            <SkeletonBox style={{ height: 24, width: 120, borderRadius: 4 }} />
          </div>
          <SkeletonBox style={{ height: 60, width: '100%', borderRadius: 4, marginTop: 14 }} />
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

  if (!movie) return <div className="flex h-screen items-center justify-center text-text-secondary">{t('movie.notFound')}</div>;

  const showtimes = showtimesByDate[selectedDate] || [];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="relative aspect-[3/4] max-h-[50vh] w-full bg-bg-secondary">
        {movie.poster_url && <img src={storageUrl(movie.poster_url)!} alt={movie.name} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/20" />
      </div>

      <div className="-mt-16 relative" style={{ padding: '0 16px' }}>
        <h1 className="text-[20px] font-bold text-text-primary leading-tight">{movie.name}</h1>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 10 }}>
          <span className="flex items-center gap-1 text-[12px] font-medium text-text-secondary bg-bg-secondary" style={{ padding: '4px 10px', borderRadius: 4 }}>
            <Clock size={12} /> {formatDuration(movie.duration)}
          </span>
          <span className="flex items-center gap-1 text-[12px] font-medium text-accent bg-accent-light" style={{ padding: '4px 10px', borderRadius: 4 }}>
            <Ticket size={12} /> {t('movie.showtimesAvailable', { count: movie.upcoming_showtimes_count })}
          </span>
        </div>
        {movie.description && <p className="text-[13px] leading-[1.7] text-text-secondary" style={{ marginTop: 14 }}>{movie.description}</p>}
      </div>

      <div className="border-t border-border" style={{ margin: '16px 16px 0' }} />

      <DatePicker dates={movieDates} selectedDate={selectedDate} onSelect={setSelectedDate} />

      <div style={{ padding: '0 16px' }}>
        <h2 className="text-[14px] font-semibold text-text-primary" style={{ marginBottom: 10 }}>{t('movie.showtimes')}</h2>
        <div className="flex flex-col gap-2">
          {showtimes.map((st) => (
            <button key={st.id} onClick={() => navigate(`/seats/${st.id}`)} className="flex items-center border border-border bg-bg-card active:opacity-70 transition-opacity" style={{ padding: '12px 14px', borderRadius: 8 }}>
              <span className="text-[16px] font-bold text-text-primary" style={{ minWidth: 50 }}>{formatTime(st.start_time)}</span>
              <span className="flex items-center gap-1 text-[12px] text-text-tertiary" style={{ marginLeft: 12 }}><MapPin size={11} /> {st.hall?.name}</span>
              <span className="text-[13px] font-semibold text-accent" style={{ marginLeft: 'auto' }}>{formatPrice(st.price)}</span>
              <ChevronRight size={16} className="text-text-tertiary" style={{ marginLeft: 8 }} />
            </button>
          ))}
          {showtimes.length === 0 && <p className="text-center text-[13px] text-text-tertiary" style={{ padding: '40px 0' }}>{t('movie.noShowtimes')}</p>}
        </div>
      </div>
    </div>
  );
}
