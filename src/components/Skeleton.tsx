import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonBoxProps {
  className?: string;
  style?: CSSProperties;
}

export function SkeletonBox({ className, style }: SkeletonBoxProps) {
  return (
    <div
      className={cn('skeleton-pulse bg-bg-secondary', className)}
      style={style}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="w-full bg-bg-secondary overflow-hidden" style={{ borderRadius: 8 }}>
      <div className="aspect-[2/3] w-full">
        <SkeletonBox className="h-full w-full" />
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <SkeletonBox style={{ height: 16, width: '80%', borderRadius: 4 }} />
        <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
          <SkeletonBox style={{ height: 12, width: 50, borderRadius: 4 }} />
          <SkeletonBox style={{ height: 12, width: 70, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden bg-bg-secondary"
      style={{ width: 'calc(100vw - 50px)', borderRadius: 8 }}
    >
      <div className="aspect-[2/3] w-full">
        <SkeletonBox className="h-full w-full" />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: 14 }}
      >
        <SkeletonBox style={{ height: 18, width: '60%', borderRadius: 4 }} />
        <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
          <SkeletonBox style={{ height: 14, width: 60, borderRadius: 4 }} />
          <SkeletonBox style={{ height: 32, width: 80, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}
