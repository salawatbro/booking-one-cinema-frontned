import { useState, useCallback, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MovieCard } from '@/components/MovieCard';
import { InfiniteCarousel } from '@/components/InfiniteCarousel';
import { useFeaturedMovies, useMovies } from '@/hooks/useApi';
import { FeaturedSkeleton, MovieCardSkeleton } from '@/components/Skeleton';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

export function HomePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  const { data: featuredMovies, isLoading: featuredLoading, error: featuredError } = useFeaturedMovies();
  const { data: movies, isLoading: moviesLoading, error: moviesError } = useMovies(debouncedSearch || undefined);

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['movies'] });
  }, [queryClient]);

  const { isRefreshing, pullDistance, handlers } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const showIndicator = pullDistance > 0 || isRefreshing;

  return (
    <div
      style={{ paddingBottom: 80 }}
      onTouchStart={handlers.onTouchStart}
      onTouchMove={handlers.onTouchMove}
      onTouchEnd={handlers.onTouchEnd}
    >
      {showIndicator && (
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{
            height: isRefreshing ? 40 : pullDistance,
            transition: isRefreshing ? 'height 0.2s ease' : 'none',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              border: '2px solid var(--accent)',
              borderTopColor: 'transparent',
              borderRadius: 10,
              animation: isRefreshing ? 'ptr-spin 0.6s linear infinite' : 'none',
              transform: isRefreshing ? undefined : `rotate(${pullDistance * 3}deg)`,
            }}
          />
        </div>
      )}

      <div style={{ padding: '12px 16px' }}>
        <div className="flex items-center gap-3 bg-bg-secondary border border-border" style={{ height: 48, padding: '0 16px' }}>
          <Search size={18} className="flex-shrink-0 text-text-tertiary" aria-hidden="true" />
          <input
            type="search"
            placeholder={t('home.search')}
            aria-label={t('home.searchLabel')}
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section style={{ marginTop: 0 }}>
        <h2 className="text-[15px] font-semibold text-text-primary" style={{ padding: '0 20px', marginBottom: 16 }}>{t('home.nowShowing')}</h2>
        {featuredError ? (
          <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
            <p className="text-[13px] text-text-tertiary">Error: {featuredError.message}</p>
          </div>
        ) : featuredLoading ? (
          <div className="flex gap-3 overflow-hidden" style={{ padding: '0 16px' }}>
            {Array.from({ length: 3 }).map((_, i) => <FeaturedSkeleton key={i} />)}
          </div>
        ) : featuredMovies && featuredMovies.length > 0 ? (
          <InfiniteCarousel>
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="featured" />
            ))}
          </InfiniteCarousel>
        ) : null}
      </section>

      <section style={{ marginTop: 24, padding: '0 16px' }}>
        <h2 className="text-[15px] font-semibold text-text-primary" style={{ marginBottom: 4 }}>{t('home.allMovies')}</h2>
        {moviesError ? (
          <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
            <p className="text-[13px] text-text-tertiary">Error: {moviesError.message}</p>
          </div>
        ) : moviesLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
