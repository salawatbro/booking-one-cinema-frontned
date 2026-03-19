import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BookingCard } from '@/components/BookingCard';
import { mockBookings, mockBookingStats } from '@/mock/data';
import { Ticket } from 'lucide-react';
import type { Booking } from '@/types/api';

type TabFilter = 'all' | Booking['status'];

const tabs: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'Barchasi' },
  { key: 'pending', label: 'Kutilmoqda' },
  { key: 'confirmed', label: 'Tasdiqlangan' },
  { key: 'cancelled', label: 'Bekor' },
];

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const filtered = activeTab === 'all' ? mockBookings : mockBookings.filter((b) => b.status === activeTab);
  const stats = mockBookingStats;

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Stats */}
      <div className="grid grid-cols-4" style={{ padding: '12px 16px', gap: 6 }}>
        {[
          { label: 'Jami', value: stats.total, color: 'text-text-primary' },
          { label: 'Tasdiqlangan', value: stats.confirmed, color: 'text-success' },
          { label: 'Kutilmoqda', value: stats.pending, color: 'text-warning' },
          { label: 'Bekor', value: stats.cancelled, color: 'text-danger' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center bg-bg-secondary border border-border"
            style={{ padding: '10px 0', borderRadius: 6 }}
          >
            <span className={cn('text-[18px] font-bold', s.color)}>{s.value}</span>
            <span className="text-[9px] text-text-tertiary" style={{ marginTop: 2 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border" style={{ padding: '0 16px' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'text-[13px] font-medium border-b-2 transition-colors -mb-px',
                isActive ? 'border-accent text-accent' : 'border-transparent text-text-tertiary',
              )}
              style={{ padding: '10px 12px' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ padding: '12px 16px 0' }}>
        {filtered.map((b) => <BookingCard key={b.id} booking={b} />)}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
            <Ticket size={36} className="text-text-tertiary/20" />
            <p className="text-[13px] text-text-tertiary" style={{ marginTop: 12 }}>Bronlar topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
}
