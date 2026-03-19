import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, ChevronRight, Ticket } from 'lucide-react';
import { formatDuration, formatPrice, formatTime } from '@/lib/utils';
import { mockMovies, mockShowtimesByDate } from '@/mock/data';
import { DatePicker } from '@/components/DatePicker';

export function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = mockMovies.find((m) => m.id === Number(id));

  const movieDates = Object.keys(mockShowtimesByDate).filter((date) =>
    mockShowtimesByDate[date].some((s) => s.movie_id === Number(id))
  );
  const [selectedDate, setSelectedDate] = useState(movieDates[0] || '');

  if (!movie) return <div className="flex h-screen items-center justify-center text-text-secondary">Kino topilmadi</div>;

  const showtimes = (mockShowtimesByDate[selectedDate] || []).filter((s) => s.movie_id === movie.id);

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero poster — shorter, with back button */}
      <div className="relative aspect-[3/4] max-h-[50vh] w-full bg-bg-secondary">
        {movie.poster_url && (
          <img src={movie.poster_url} alt={movie.name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 h-9 w-9 flex items-center justify-center bg-black/40 text-white backdrop-blur-sm active:opacity-70 transition-opacity"
          style={{ borderRadius: 8 }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Movie info */}
      <div style={{ padding: '0 16px', marginTop: -40, position: 'relative' }}>
        <h1 className="text-[22px] font-bold text-text-primary leading-tight">{movie.name}</h1>

        {/* Meta tags */}
        <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 10 }}>
          <span
            className="flex items-center gap-1 text-[12px] font-medium text-text-secondary bg-bg-secondary"
            style={{ padding: '4px 10px', borderRadius: 4 }}
          >
            <Clock size={12} /> {formatDuration(movie.duration)}
          </span>
          <span
            className="flex items-center gap-1 text-[12px] font-medium text-accent bg-accent-light"
            style={{ padding: '4px 10px', borderRadius: 4 }}
          >
            <Ticket size={12} /> {movie.upcoming_showtimes_count} seans mavjud
          </span>
        </div>

        {/* Description */}
        {movie.description && (
          <p className="text-[13px] leading-[1.7] text-text-secondary" style={{ marginTop: 14 }}>
            {movie.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border" style={{ margin: '16px 16px 0' }} />

      {/* Date picker */}
      <DatePicker dates={movieDates} selectedDate={selectedDate} onSelect={setSelectedDate} />

      {/* Showtimes */}
      <div style={{ padding: '0 16px' }}>
        <h2 className="text-[14px] font-semibold text-text-primary" style={{ marginBottom: 10 }}>
          Seanslar
        </h2>
        <div className="flex flex-col gap-2">
          {showtimes.map((st) => (
            <button
              key={st.id}
              onClick={() => navigate(`/seats/${st.id}`)}
              className="flex items-center border border-border bg-bg-card active:opacity-70 transition-opacity"
              style={{ padding: '12px 14px', borderRadius: 8 }}
            >
              <span className="text-[16px] font-bold text-text-primary" style={{ minWidth: 50 }}>
                {formatTime(st.start_time)}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-text-tertiary" style={{ marginLeft: 12 }}>
                <MapPin size={11} /> {st.hall?.name}
              </span>
              <span className="text-[13px] font-semibold text-accent" style={{ marginLeft: 'auto' }}>
                {formatPrice(st.price)}
              </span>
              <ChevronRight size={16} className="text-text-tertiary" style={{ marginLeft: 8 }} />
            </button>
          ))}
          {showtimes.length === 0 && (
            <p className="text-center text-[13px] text-text-tertiary" style={{ padding: '40px 0' }}>
              Bu sana uchun seans topilmadi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
