import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Movie } from '@/types/api';
import { formatDuration } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  variant?: 'grid' | 'featured';
}

export function MovieCard({ movie, variant = 'grid' }: MovieCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (variant === 'featured') {
    return (
      <div className="relative flex-shrink-0 overflow-hidden rounded-lg" style={{ width: 'calc(100vw - 50px)' }}>
        <button onClick={() => navigate(`/movies/${movie.id}`)} className="w-full">
          <div className="aspect-[2/3] w-full bg-bg-secondary">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-tertiary text-[12px]">{t('movie.noPoster')}</div>
            )}
          </div>
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: 14 }}>
          <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-1">{movie.name}</h3>
          <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
            <span className="flex items-center gap-1 text-[12px] text-white/60">
              <Clock size={12} /> {formatDuration(movie.duration)}
            </span>
            <button
              onClick={() => navigate(`/movies/${movie.id}`)}
              className="bg-accent text-white text-[12px] font-semibold active:opacity-80 transition-opacity"
              style={{ padding: '7px 16px', borderRadius: 6 }}
            >
              {t('movie.book')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="w-full text-left bg-bg-secondary rounded-lg overflow-hidden active:opacity-70 transition-opacity"
    >
      <div className="aspect-[2/3] w-full bg-bg-secondary">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-tertiary text-[10px]">{t('movie.noPoster')}</div>
        )}
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <h3 className="text-[13px] font-semibold text-text-primary leading-snug line-clamp-2">{movie.name}</h3>
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary" style={{ marginTop: 4 }}>
          <span className="flex items-center gap-1"><Clock size={10} />{formatDuration(movie.duration)}</span>
          <span className="text-accent font-medium">{t('movie.showtimesAvailable', { count: movie.upcoming_showtimes_count })}</span>
        </div>
      </div>
    </button>
  );
}
