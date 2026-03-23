import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { BookingCard } from '@/components/BookingCard';
import { useBookings, useBookingStats } from '@/hooks/useApi';
import { SkeletonBox } from '@/components/Skeleton';
import { Ticket } from 'lucide-react';
import type { Booking } from '@/types/api';
import { useIsDesktop } from '@/hooks/useIsDesktop';

type TabFilter = 'all' | Booking['status'];

export function BookingsPage() {
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookings(activeTab === 'all' ? undefined : activeTab);
  const { data: stats, isLoading: statsLoading } = useBookingStats();

  const tabs: { key: TabFilter; label: string }[] = [
    { key: 'all', label: t('bookings.all') },
    { key: 'pending', label: t('bookings.pending') },
    { key: 'confirmed', label: t('bookings.confirmed') },
    { key: 'cancelled', label: t('bookings.cancelled') },
  ];

  return (
    <div style={{ paddingBottom: isDesktop ? 24 : 80, maxWidth: isDesktop ? 900 : undefined, marginLeft: isDesktop ? 'auto' : undefined, marginRight: isDesktop ? 'auto' : undefined }}>
      <div className="grid grid-cols-4" style={{ padding: '12px 16px', gap: 6 }}>
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center bg-bg-secondary border border-border" style={{ padding: '10px 0', borderRadius: 6 }}>
              <SkeletonBox style={{ height: 22, width: 30, borderRadius: 4 }} />
              <SkeletonBox style={{ height: 10, width: 40, borderRadius: 4, marginTop: 4 }} />
            </div>
          ))
        ) : (
          [
            { label: t('profile.total'), value: stats?.total ?? 0, color: 'text-text-primary' },
            { label: t('profile.confirmed'), value: stats?.confirmed ?? 0, color: 'text-success' },
            { label: t('profile.pending'), value: stats?.pending ?? 0, color: 'text-warning' },
            { label: t('profile.cancelled'), value: stats?.cancelled ?? 0, color: 'text-danger' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center bg-bg-secondary border border-border" style={{ padding: '10px 0', borderRadius: 6 }}>
              <span className={cn('text-[18px] font-bold', s.color)}>{s.value}</span>
              <span className="text-[9px] text-text-tertiary" style={{ marginTop: 2 }}>{s.label}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex border-b border-border" style={{ padding: '0 16px' }}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn('text-[13px] font-medium border-b-2 transition-colors -mb-px', activeTab === tab.key ? 'border-accent text-accent' : 'border-transparent text-text-tertiary')} style={{ padding: '10px 12px' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        {bookingsError ? (
          <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
            <p className="text-[13px] text-text-tertiary">Error: {bookingsError.message}</p>
          </div>
        ) : bookingsLoading ? (
          <div className="flex flex-col" style={{ gap: 8 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBox key={i} style={{ height: 100, width: '100%', borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <>
            {bookings?.map((b) => <BookingCard key={b.id} booking={b} />)}
            {bookings?.length === 0 && (
              <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
                <Ticket size={36} className="text-text-tertiary/20" />
                <p className="text-[13px] text-text-tertiary" style={{ marginTop: 12 }}>{t('bookings.notFound')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
