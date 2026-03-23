import { useNavigate } from 'react-router-dom';
import { Phone, AtSign, Globe, Ticket, ChevronRight, MessageSquarePlus, Film, LogOut, Send, Instagram, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/constants';
import { useProfile, useBookingStats, useSettings, useUpdateLanguage } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { isTelegram } from '@/lib/api';
import { SkeletonBox } from '@/components/Skeleton';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user: webUser, logout } = useAuth();
  const isDesktop = useIsDesktop();

  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: stats, isLoading: statsLoading } = useBookingStats();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const updateLanguage = useUpdateLanguage();

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const photoUrl = tgUser?.photo_url || webUser?.photo_url;
  const initials = profile ? (profile.first_name[0] || '') + (profile.last_name?.[0] || '') : '';

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    updateLanguage.mutate(code);
  };

  if (profileError) {
    return (
      <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
        <p className="text-[13px] text-text-tertiary">Error: {profileError.message}</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: isDesktop ? 24 : 80, maxWidth: isDesktop ? 640 : undefined, marginLeft: isDesktop ? 'auto' : undefined, marginRight: isDesktop ? 'auto' : undefined }}>
      <div className="flex items-center gap-3" style={{ padding: '20px 16px' }}>
        {profileLoading ? (
          <>
            <SkeletonBox style={{ width: 56, height: 56, borderRadius: 28 }} />
            <div className="flex flex-col" style={{ gap: 6 }}>
              <SkeletonBox style={{ height: 20, width: 140, borderRadius: 4 }} />
              <SkeletonBox style={{ height: 14, width: 180, borderRadius: 4 }} />
            </div>
          </>
        ) : profile ? (
          <>
            <div className="flex items-center justify-center bg-accent text-white text-[18px] font-bold flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56, borderRadius: 28 }}>
              {photoUrl ? (
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-text-primary">{profile.first_name} {profile.last_name || ''}</h1>
              <p className="text-[11px] text-text-tertiary" style={{ marginTop: 2 }}>ID: {profile.telegram_id}</p>
              <div className="flex items-center gap-3 text-[12px] text-text-tertiary" style={{ marginTop: 2 }}>
                {profile.username && <span className="flex items-center gap-1"><AtSign size={11} /> {profile.username}</span>}
                {profile.phone && <span className="flex items-center gap-1"><Phone size={11} /> {profile.phone}</span>}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-4" style={{ padding: '0 16px', gap: 6 }}>
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center bg-bg-secondary" style={{ padding: '10px 0', borderRadius: 6 }}>
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
            <div key={s.label} className="flex flex-col items-center bg-bg-secondary" style={{ padding: '10px 0', borderRadius: 6 }}>
              <span className={cn('text-[18px] font-bold', s.color)}>{s.value}</span>
              <span className="text-[9px] text-text-tertiary" style={{ marginTop: 2 }}>{s.label}</span>
            </div>
          ))
        )}
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
          { icon: Ticket, label: t('profile.myBookings'), to: '/bookings', count: stats?.total },
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
        {settingsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3" style={{ padding: '14px 0' }}>
              <SkeletonBox style={{ height: 18, width: 18, borderRadius: 4 }} />
              <SkeletonBox style={{ height: 16, width: 120, borderRadius: 4 }} />
            </div>
          ))
        ) : settings ? (
          [
            { icon: Phone, label: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
            { icon: Send, label: 'Telegram', href: settings.telegram },
            { icon: Instagram, label: 'Instagram', href: settings.instagram },
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
          ))
        ) : null}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {!isTelegram() && (
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-2 text-danger text-[14px] font-medium border border-border active:opacity-70 transition-opacity"
            style={{ height: 44, borderRadius: 8 }}
          >
            <LogOut size={16} /> {t('profile.logout')}
          </button>
        )}
      </div>
    </div>
  );
}
