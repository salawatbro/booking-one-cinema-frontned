import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, Ticket, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export function BottomNav() {
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();

  if (isDesktop) return null;

  const tabs = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/schedule', icon: CalendarDays, label: t('nav.schedule') },
    { to: '/bookings', icon: Ticket, label: t('nav.bookings') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around" style={{ height: 60 }}>
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 px-4 py-2 transition-colors', isActive ? 'text-accent' : 'text-text-tertiary')
            }
          >
            <Icon size={24} strokeWidth={1.8} />
            <span className="text-[11px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
