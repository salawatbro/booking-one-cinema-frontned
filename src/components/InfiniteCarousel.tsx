import { useRef, useEffect, useCallback, type ReactNode } from 'react';

interface InfiniteCarouselProps {
  children: ReactNode[];
  gap?: number;
}

export function InfiniteCarousel({ children, gap = 10 }: InfiniteCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const count = children.length;

  const getItems = useCallback(() => {
    return [...children, ...children, ...children];
  }, [children]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;

    const sectionWidth = el.scrollWidth / 3;
    el.scrollLeft = sectionWidth;

    const handleScroll = () => {
      const sw = el.scrollWidth / 3;
      if (el.scrollLeft <= 0) {
        el.scrollLeft += sw;
      } else if (el.scrollLeft >= sw * 2) {
        el.scrollLeft -= sw;
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [count]);

  if (count === 0) return null;

  // Side padding so first/last items peek from edges and active is centered
  const sidePadding = 15;

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto scrollbar-hide"
      style={{
        gap,
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        scrollSnapType: 'x mandatory',
      }}
    >
      {getItems().map((child, i) => (
        <div key={i} style={{ scrollSnapAlign: 'center' }}>
          {child}
        </div>
      ))}
    </div>
  );
}
