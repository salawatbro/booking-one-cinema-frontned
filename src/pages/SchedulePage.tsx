import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatTime, formatPrice } from '@/lib/utils';
import { mockShowtimesByDate, mockMovies } from '@/mock/data';
import { DatePicker } from '@/components/DatePicker';

export function SchedulePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dates = Object.keys(mockShowtimesByDate);
  const [selectedDate, setSelectedDate] = useState(dates[0] || '');
  const showtimes = mockShowtimesByDate[selectedDate] || [];
  const movieIds = [...new Set(showtimes.map((s) => s.movie_id))];
  const movies = movieIds.map((id) => mockMovies.find((m) => m.id === id)).filter(Boolean);

  return (
    <div style={{ paddingBottom: 80 }}>
      <DatePicker dates={dates} selectedDate={selectedDate} onSelect={setSelectedDate} />

      <div className="grid grid-cols-2 gap-3" style={{ padding: '8px 16px 0' }}>
        {movies.map((movie) => {
          if (!movie) return null;
          const movieShowtimes = showtimes.filter((s) => s.movie_id === movie.id);
          return (
            <div key={movie.id} className="bg-bg-secondary rounded-lg overflow-hidden">
              <button onClick={() => navigate(`/movies/${movie.id}`)} className="w-full active:opacity-70 transition-opacity">
                <div className="aspect-[2/3] w-full bg-bg-secondary">
                  {movie.poster_url ? (
                    <img src={movie.poster_url} alt={movie.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-tertiary text-[12px]">{t('movie.noPoster')}</div>
                  )}
                </div>
              </button>
              <div style={{ padding: '8px 10px 10px' }}>
                <h3 className="text-[13px] font-semibold text-text-primary leading-snug line-clamp-1">{movie.name}</h3>
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

      {movies.length === 0 && <p className="text-center text-[13px] text-text-tertiary" style={{ paddingTop: 60 }}>{t('movie.noShowtimesDay')}</p>}
    </div>
  );
}
