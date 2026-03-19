import { useNavigate } from 'react-router-dom';
import { Phone, AtSign, Globe, Ticket, ChevronRight, MessageSquarePlus, Film, LogOut, Send, Instagram, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/constants';
import { mockProfile, mockBookingStats, mockContactInfo } from '@/mock/data';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const profile = mockProfile;
  const stats = mockBookingStats;
  const initials = (profile.first_name[0] || '') + (profile.last_name?.[0] || '');

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="flex items-center gap-3" style={{ padding: '20px 16px' }}>
        <div className="flex items-center justify-center bg-accent text-white text-[18px] font-bold flex-shrink-0" style={{ width: 56, height: 56, borderRadius: 28 }}>{initials}</div>
        <div>
          <h1 className="text-[17px] font-bold text-text-primary">{profile.first_name} {profile.last_name || ''}</h1>
          <div className="flex items-center gap-3 text-[12px] text-text-tertiary" style={{ marginTop: 2 }}>
            {profile.username && <span className="flex items-center gap-1"><AtSign size={11} /> {profile.username}</span>}
            {profile.phone && <span className="flex items-center gap-1"><Phone size={11} /> {profile.phone}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ padding: '0 16px', gap: 6 }}>
        {[
          { label: t('profile.total'), value: stats.total, color: 'text-text-primary' },
          { label: t('profile.confirmed'), value: stats.confirmed, color: 'text-success' },
          { label: t('profile.pending'), value: stats.pending, color: 'text-warning' },
          { label: t('profile.cancelled'), value: stats.cancelled, color: 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center bg-bg-secondary" style={{ padding: '10px 0', borderRadius: 6 }}>
            <span className={cn('text-[18px] font-bold', s.color)}>{s.value}</span>
            <span className="text-[9px] text-text-tertiary" style={{ marginTop: 2 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 8 }}>
          <Globe size={14} /> <span>{t('profile.language')}</span>
        </div>
        <div className="grid grid-cols-2" style={{ gap: 6 }}>
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => changeLang(lang.code)} className={cn('text-[13px] font-medium border transition-colors', i18n.language === lang.code ? 'bg-accent text-white border-accent' : 'bg-bg-card text-text-secondary border-border')} style={{ height: 40, borderRadius: 6 }}>
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" style={{ margin: '16px 16px 0' }} />

      <div style={{ padding: '8px 16px 0' }}>
        {[
          { icon: Ticket, label: t('profile.myBookings'), to: '/bookings', count: stats.total },
          { icon: MessageSquarePlus, label: t('profile.movieRequests'), to: '/movie-requests' },
          { icon: Film, label: t('profile.requestMovie'), to: '/movie-requests/new' },
        ].map((item) => (
          <button key={item.to} onClick={() => navigate(item.to)} className="flex w-full items-center gap-3 border-b border-border-light active:opacity-70 transition-opacity" style={{ padding: '14px 0' }}>
            <item.icon size={18} className="text-text-tertiary" />
            <span className="flex-1 text-left text-[14px] text-text-primary">{item.label}</span>
            {'count' in item && item.count !== undefined && <span className="text-[12px] font-semibold text-accent" style={{ marginRight: 4 }}>{item.count}</span>}
            <ChevronRight size={16} className="text-text-tertiary" />
          </button>
        ))}
      </div>

      {/* Social links */}
      <div className="border-t border-border" style={{ margin: '16px 16px 0' }} />

      <div style={{ padding: '8px 16px 0' }}>
        {[
          { icon: Phone, label: mockContactInfo.phone, href: `tel:${mockContactInfo.phone.replace(/\s/g, '')}` },
          { icon: Send, label: 'Telegram', href: mockContactInfo.telegram },
          { icon: Instagram, label: 'Instagram', href: mockContactInfo.instagram },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 border-b border-border-light active:opacity-70 transition-opacity"
            style={{ padding: '14px 0' }}
          >
            <item.icon size={18} className="text-text-tertiary" />
            <span className="flex-1 text-left text-[14px] text-text-primary">{item.label}</span>
            <ExternalLink size={14} className="text-text-tertiary" />
          </a>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <button className="w-full flex items-center justify-center gap-2 text-danger text-[14px] font-medium border border-border active:opacity-70 transition-opacity" style={{ height: 44, borderRadius: 8 }}>
          <LogOut size={16} /> {t('profile.logout')}
        </button>
      </div>
    </div>
  );
}
