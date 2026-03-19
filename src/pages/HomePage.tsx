import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MovieCard } from '@/components/MovieCard';
import { InfiniteCarousel } from '@/components/InfiniteCarousel';
import { mockFeaturedMovies, mockMovies } from '@/mock/data';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

export function HomePage() {
  const { t } = useTranslation();
  const [, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    // Simulate data reload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshKey((k) => k + 1);
  }, []);

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
          <input type="search" placeholder={t('home.search')} aria-label={t('home.searchLabel')} className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none" />
        </div>
      </div>

      <section style={{ marginTop: 0 }}>
        <h2 className="text-[15px] font-semibold text-text-primary" style={{ padding: '0 20px', marginBottom: 16 }}>{t('home.nowShowing')}</h2>
        <InfiniteCarousel>
          {mockFeaturedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="featured" />
          ))}
        </InfiniteCarousel>
      </section>

      <section style={{ marginTop: 24, padding: '0 16px' }}>
        <h2 className="text-[15px] font-semibold text-text-primary" style={{ marginBottom: 4 }}>{t('home.allMovies')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {mockMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
