import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { mockProfile } from '@/mock/data';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/constants';
import { updateLanguage } from '@/lib/api';

export function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const photoUrl = tgUser?.photo_url;
  const initials = tgUser
    ? (tgUser.first_name[0] || '') + (tgUser.last_name?.[0] || '')
    : (mockProfile.first_name[0] || '') + (mockProfile.last_name?.[0] || '');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
    <div className="flex items-center justify-between border-b border-border" style={{ padding: '0 20px', paddingTop: isMobile ? 'calc(env(safe-area-inset-top, 0px) + 38px)' : '0px', minHeight: isMobile ? 'calc(56px + env(safe-area-inset-top, 0px) + 38px)' : '56px' }}>
      <button
        onClick={toggle}
        aria-label={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
        className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-bg-secondary active:opacity-70 transition-opacity"
      >
        {theme === 'light' ? <Moon size={18} className="text-text-secondary" /> : <Sun size={18} className="text-yellow-400" />}
      </button>

      <button onClick={() => navigate('/')} className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
        <span className="text-[16px] font-bold text-text-primary">BookingOne</span>
      </button>

      <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
