import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Sun, Moon, ChevronDown, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/constants';
import { isTelegram, updateLanguage } from '@/lib/api';

export function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const { isAuthenticated, user: webUser } = useAuth();
  const isDesktop = useIsDesktop();
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const photoUrl = tgUser?.photo_url || webUser?.photo_url;
  const displayName = tgUser
    ? { first: tgUser.first_name, last: tgUser.last_name }
    : webUser
      ? { first: webUser.first_name, last: webUser.last_name }
      : null;
  const initials = displayName
    ? (displayName.first[0] || '') + (displayName.last?.[0] || '')
    : '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const inTelegram = isTelegram();

  const navTabs = [
    { to: '/', label: t('nav.home') },
    { to: '/schedule', label: t('nav.schedule') },
    { to: '/bookings', label: t('nav.bookings') },
    { to: '/profile', label: t('nav.profile') },
  ];

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangOpen(false);
    updateLanguage(code).catch(() => {});
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <header className="border-b border-border" style={{ paddingTop: isMobile && inTelegram ? 'calc(env(safe-area-inset-top, 0px) + 38px)' : undefined }}>
      <div className="flex items-center justify-between" style={{ padding: '0 20px', minHeight: 56, maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Left: Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[16px] font-bold text-text-primary">BookingOne</span>
        </button>

        {/* Center: Desktop nav */}
        {isDesktop && (
          <nav className="flex items-center gap-1">
            {navTabs.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-[13px] font-medium transition-colors',
                    isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary',
                  )
                }
                style={{ padding: '6px 14px', borderRadius: 6 }}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-bg-secondary active:opacity-70 transition-opacity"
          >
            {theme === 'light' ? <Moon size={18} className="text-text-secondary" /> : <Sun size={18} className="text-yellow-400" />}
          </button>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label={t('header.selectLang')}
              aria-expanded={langOpen}
              className="flex items-center gap-0.5 h-8 px-2 rounded-md hover:bg-bg-secondary active:opacity-70 transition-opacity"
            >
              <span className="text-[12px] font-semibold text-text-secondary">{currentLang.short}</span>
              <ChevronDown size={12} className={cn('text-text-tertiary transition-transform', langOpen && 'rotate-180')} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-10 z-[100] bg-bg-card border border-border shadow-lg overflow-hidden" style={{ minWidth: 56, borderRadius: 4 }}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={cn(
                      'w-full px-3 py-2 text-[12px] font-semibold text-center transition-colors',
                      i18n.language === lang.code ? 'text-accent bg-accent-light' : 'text-text-primary hover:bg-bg-secondary',
                    )}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile')}
              aria-label={t('header.profile')}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold overflow-hidden"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              aria-label={t('auth.login')}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-accent text-white active:opacity-80 transition-opacity"
            >
              <LogIn size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
