import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatTime, formatPrice } from '@/lib/utils';
import { useShowtimeCalendar, useShowtimes } from '@/hooks/useApi';
import { storageUrl } from '@/lib/api';
import { SkeletonBox, MovieCardSkeleton } from '@/components/Skeleton';
import { DatePicker } from '@/components/DatePicker';

export function SchedulePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: calendar, isLoading: calendarLoading } = useShowtimeCalendar();
  const dates = calendar?.map((d) => d.date) || [];
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  const { data: showtimes, isLoading: showtimesLoading, error: showtimesError } = useShowtimes(
    selectedDate ? { date: selectedDate } : undefined,
  );

  // Group showtimes by movie
  const movieMap = new Map<number, { movie: NonNullable<typeof showtimes>[0]['movie']; showtimes: NonNullable<typeof showtimes> }>();
  if (showtimes) {
    for (const st of showtimes) {
      if (!movieMap.has(st.movie_id)) {
        movieMap.set(st.movie_id, { movie: st.movie, showtimes: [] });
      }
      movieMap.get(st.movie_id)!.showtimes.push(st);
    }
  }
  const movieEntries = Array.from(movieMap.entries());

  return (
    <div style={{ paddingBottom: 80 }}>
      {calendarLoading ? (
        <div className="flex gap-2" style={{ padding: '12px 16px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBox key={i} style={{ height: 56, width: 52, borderRadius: 8 }} />
          ))}
        </div>
      ) : (
        <DatePicker dates={dates} selectedDate={selectedDate} onSelect={setSelectedDate} />
      )}

      {showtimesError ? (
        <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
          <p className="text-[13px] text-text-tertiary">Error: {showtimesError.message}</p>
        </div>
      ) : showtimesLoading ? (
        <div className="grid grid-cols-2 gap-3" style={{ padding: '8px 16px 0' }}>
          {Array.from({ length: 4 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3" style={{ padding: '8px 16px 0' }}>
          {movieEntries.map(([movieId, { movie, showtimes: movieShowtimes }]) => {
            return (
              <div key={movieId} className="bg-bg-secondary rounded-lg overflow-hidden">
                <button onClick={() => navigate(`/movies/${movieId}`)} className="w-full active:opacity-70 transition-opacity">
                  <div className="aspect-[2/3] w-full bg-bg-secondary">
                    {movie?.poster_url ? (
                      <img src={storageUrl(movie.poster_url)!} alt={movie.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-tertiary text-[12px]">{t('movie.noPoster')}</div>
                    )}
                  </div>
                </button>
                <div style={{ padding: '8px 10px 10px' }}>
                  <h3 className="text-[13px] font-semibold text-text-primary leading-snug line-clamp-1">{movie?.name}</h3>
                  <div className="flex flex-col gap-1.5" style={{ marginTop: 6 }}>
                    {movieShowtimes.map((st) => (
                      <button key={st.id} onClick={() => navigate(`/seats/${st.id}`)} className="flex items-center justify-between border border-border bg-bg-card active:opacity-70 transition-opacity" style={{ padding: '6px 8px', borderRadius: 4 }}>
                        <span className="text-[12px] font-bold text-text-primary">{formatTime(st.start_time)}</span>
                        <span className="text-[10px] text-text-tertiary">{st.hall?.name}</span>
                        <span className="text-[11px] font-semibold text-accent">{formatPrice(st.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!showtimesLoading && movieEntries.length === 0 && <p className="text-center text-[13px] text-text-tertiary" style={{ paddingTop: 60 }}>{t('movie.noShowtimesDay')}</p>}
    </div>
  );
}
