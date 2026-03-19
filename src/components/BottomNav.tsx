import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, Ticket, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { t } = useTranslation();

  const tabs = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/schedule', icon: CalendarDays, label: t('nav.schedule') },
    { to: '/bookings', icon: Ticket, label: t('nav.bookings') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border">
      <div className="flex items-center justify-around h-14 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-0.5 px-3 py-1 transition-colors', isActive ? 'text-accent' : 'text-text-tertiary')
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
