import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { mockProfile } from '@/mock/data';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'uz', short: 'UZ' },
  { code: 'ru', short: 'RU' },
  { code: 'kk', short: 'KZ' },
] as const;

export function Header() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [selectedLang, setSelectedLang] = useState(mockProfile.language);
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === selectedLang) || languages[0];
  const initials = (mockProfile.first_name[0] || '') + (mockProfile.last_name?.[0] || '');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center justify-between h-14 border-b border-border" style={{ padding: '0 20px' }}>
      {/* Left: Theme toggle */}
      <button
        onClick={toggle}
        className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-bg-secondary active:opacity-70 transition-opacity"
      >
        {theme === 'light' ? (
          <Moon size={18} className="text-text-secondary" />
        ) : (
          <Sun size={18} className="text-yellow-400" />
        )}
      </button>

      {/* Center: Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
        <span className="text-[16px] font-bold text-text-primary">BookingOne</span>
      </button>

      {/* Right: Language + Profile */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setLangOpen(!langOpen)}
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
                  onClick={() => { setSelectedLang(lang.code); setLangOpen(false); }}
                  className={cn(
                    'w-full px-3 py-2 text-[12px] font-semibold text-center transition-colors',
                    selectedLang === lang.code ? 'text-accent bg-accent-light' : 'text-text-primary hover:bg-bg-secondary',
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
          className="h-8 w-8 flex items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold"
        >
          {initials}
        </button>
      </div>
    </div>
  );
}
