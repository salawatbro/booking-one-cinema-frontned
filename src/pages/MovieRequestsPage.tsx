import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, Clock, Film, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn, formatDate } from '@/lib/utils';
import { useMovieRequests } from '@/hooks/useApi';
import { SkeletonBox } from '@/components/Skeleton';
import type { MovieRequest } from '@/types/api';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { WebBackButton } from '@/components/WebBackButton';
import { useIsDesktop } from '@/hooks/useIsDesktop';

const statusConfig: Record<MovieRequest['status'], { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-warning-light', text: 'text-warning', dot: 'bg-warning' },
  approved: { bg: 'bg-success-light', text: 'text-success', dot: 'bg-success' },
  rejected: { bg: 'bg-danger-light', text: 'text-danger', dot: 'bg-danger' },
};

export function MovieRequestsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const { data: movieRequests, isLoading, error } = useMovieRequests();

  const { isAvailable: hasBackButton } = useTelegramBackButton(() => navigate(-1));

  return (
    <div style={{ paddingBottom: isDesktop ? 24 : 80, maxWidth: isDesktop ? 800 : undefined, marginLeft: isDesktop ? 'auto' : undefined, marginRight: isDesktop ? 'auto' : undefined }}>
      <div className="flex items-center justify-between border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        <div className="flex items-center gap-3">
          {!hasBackButton && <WebBackButton />}
          <h1 className="text-[15px] font-semibold text-text-primary">{t('movieRequest.title')}</h1>
        </div>
        <button onClick={() => navigate('/movie-requests/new')} className="flex items-center gap-1.5 bg-accent text-white text-[12px] font-semibold active:opacity-80 transition-opacity" style={{ height: 34, padding: '0 12px', borderRadius: 6 }}>
          <Plus size={14} /> {t('movieRequest.new')}
        </button>
      </div>

      <div style={{ padding: '8px 16px 0' }}>
        {error ? (
          <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
            <p className="text-[13px] text-text-tertiary">Error: {error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col" style={{ gap: 8 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBox key={i} style={{ height: 120, width: '100%', borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <>
            {movieRequests?.length === 0 && (
              <div className="flex flex-col items-center" style={{ paddingTop: 60 }}>
                <Film size={36} className="text-text-tertiary/20" />
                <p className="text-[13px] text-text-tertiary" style={{ marginTop: 12 }}>{t('movieRequest.notFound')}</p>
              </div>
            )}

            {movieRequests?.map((req) => {
              const config = statusConfig[req.status];
              return (
                <div key={req.id} className="bg-bg-secondary" style={{ padding: 14, borderRadius: 8, marginBottom: 8 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span className={cn('flex items-center gap-1.5 text-[11px] font-semibold', config.bg, config.text)} style={{ padding: '3px 8px', borderRadius: 4 }}>
                      <span className={cn('rounded-full', config.dot)} style={{ width: 6, height: 6 }} />
                      {t(`status.${req.status}`)}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      {formatDate(req.created_at.split('T')[0])}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-text-primary">
                    {req.movie_name}{req.movie_year && <span className="text-text-tertiary font-normal"> ({req.movie_year})</span>}
                  </h3>
                  <div className="flex items-center flex-wrap text-[11px] text-text-tertiary" style={{ marginTop: 6, gap: '4px 12px' }}>
                    {req.preferred_date && <span className="flex items-center gap-1"><Calendar size={11} /> {req.preferred_date}</span>}
                    {req.preferred_time && <span className="flex items-center gap-1"><Clock size={11} /> {req.preferred_time}</span>}
                    <span className="flex items-center gap-1"><Users size={11} /> {t('movieRequest.guests', { count: req.guests_count })}</span>
                  </div>
                  {req.admin_note && (
                    <div className="flex items-start gap-2 bg-bg-card border border-border" style={{ marginTop: 10, padding: '8px 10px', borderRadius: 6 }}>
                      <MessageCircle size={14} className="text-accent flex-shrink-0" style={{ marginTop: 1 }} />
                      <p className="text-[12px] text-text-primary leading-relaxed">{req.admin_note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
