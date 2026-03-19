import { Search } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';
import { InfiniteCarousel } from '@/components/InfiniteCarousel';
import { mockFeaturedMovies, mockMovies } from '@/mock/data';

export function HomePage() {
  return (
    <div style={{ paddingBottom: 80 }}>

      <div style={{ padding: '12px 16px' }}>
        <div
          className="flex items-center gap-3 bg-bg-secondary border border-border"
          style={{ height: 48, padding: '0 16px' }}
        >
          <Search size={18} className="flex-shrink-0 text-text-tertiary" />
          <input
            type="text"
            placeholder="Kino qidirish..."
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
          />
        </div>
      </div>

      <section style={{ marginTop: 0 }}>
        <h2
          className="text-[15px] font-semibold text-text-primary"
          style={{ padding: '0 20px', marginBottom: 16 }}
        >
          Bugun ekranda
        </h2>
        <InfiniteCarousel>
          {mockFeaturedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="featured" />
          ))}
        </InfiniteCarousel>
      </section>

      <section style={{ marginTop: 24, padding: '0 16px' }}>
        <h2 className="text-[15px] font-semibold text-text-primary" style={{ marginBottom: 4 }}>
          Barcha kinolar
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {mockMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
