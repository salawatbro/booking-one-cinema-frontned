import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Film, Calendar, Clock, Users, Link, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { WebBackButton } from '@/components/WebBackButton';
import { useCreateMovieRequest } from '@/hooks/useApi';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export function MovieRequestFormPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createMovieRequest = useCreateMovieRequest();

  const isDesktop = useIsDesktop();
  const { isAvailable: hasBackButton } = useTelegramBackButton(() => navigate(-1));

  const [form, setForm] = useState({
    movie_name: '', movie_year: '', trailer_url: '',
    preferred_date: '', preferred_time: '', guests_count: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMovieRequest.mutate(
      {
        movie_name: form.movie_name,
        movie_year: form.movie_year ? Number(form.movie_year) : undefined,
        trailer_url: form.trailer_url || undefined,
        preferred_date: form.preferred_date || undefined,
        preferred_time: form.preferred_time || undefined,
        guests_count: Number(form.guests_count),
      },
      {
        onSuccess: () => {
          navigate('/movie-requests');
        },
      },
    );
  };

  const inputCls = 'w-full bg-bg-secondary border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors';

  return (
    <div style={{ paddingBottom: isDesktop ? 24 : 80, maxWidth: isDesktop ? 640 : undefined, marginLeft: isDesktop ? 'auto' : undefined, marginRight: isDesktop ? 'auto' : undefined }}>
      <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        {!hasBackButton && <WebBackButton />}
        <h1 className="text-[15px] font-semibold text-text-primary">{t('movieRequest.formTitle')}</h1>
      </div>

      <div className="bg-bg-secondary" style={{ padding: '12px 16px' }}>
        <p className="text-[12px] text-text-secondary leading-relaxed">{t('movieRequest.formDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '16px 16px 0' }}>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="movie_name" className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Film size={13} /> {t('movieRequest.movieName')} <span className="text-danger">*</span>
          </label>
          <input id="movie_name" type="text" required maxLength={255} placeholder={t('movieRequest.movieNamePlaceholder')} value={form.movie_name} onChange={(e) => setForm({ ...form, movie_name: e.target.value })} className={inputCls} style={{ height: 44, padding: '0 12px', borderRadius: 6 }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="movie_year" className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Hash size={13} /> {t('movieRequest.releaseYear')}
          </label>
          <input id="movie_year" type="number" min={1900} max={2030} placeholder="2026" value={form.movie_year} onChange={(e) => setForm({ ...form, movie_year: e.target.value })} className={inputCls} style={{ height: 44, padding: '0 12px', borderRadius: 6 }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="trailer_url" className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Link size={13} /> {t('movieRequest.trailerLink')}
          </label>
          <input id="trailer_url" type="url" maxLength={500} placeholder="https://youtube.com/watch?v=..." value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} className={inputCls} style={{ height: 44, padding: '0 12px', borderRadius: 6 }} />
        </div>

        <div className="flex" style={{ gap: 10, marginBottom: 14 }}>
          <div className="flex-1">
            <label htmlFor="preferred_date" className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
              <Calendar size={13} /> {t('movieRequest.preferredDate')}
            </label>
            <input id="preferred_date" type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} className={inputCls} style={{ height: 44, padding: '0 12px', borderRadius: 6 }} />
          </div>
          <div className="flex-1">
            <label htmlFor="preferred_time" className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
              <Clock size={13} /> {t('movieRequest.preferredTime')}
            </label>
            <input id="preferred_time" type="time" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} className={inputCls} style={{ height: 44, padding: '0 12px', borderRadius: 6 }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="guests_count" className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Users size={13} /> {t('movieRequest.guestsCount')} <span className="text-danger">*</span>
          </label>
          <input id="guests_count" type="number" required min={1} max={50} placeholder="5" value={form.guests_count} onChange={(e) => setForm({ ...form, guests_count: e.target.value })} className={inputCls} style={{ height: 44, padding: '0 12px', borderRadius: 6 }} />
        </div>

        {createMovieRequest.isError && (
          <div className="bg-danger-light" style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 8 }}>
            <p className="text-[12px] text-danger">Error: {createMovieRequest.error.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={createMovieRequest.isPending}
          className="w-full bg-accent text-white text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-50"
          style={{ height: 48, borderRadius: 8 }}
        >
          <Send size={14} /> {createMovieRequest.isPending ? t('movieRequest.submitting') : t('movieRequest.submit')}
        </button>
      </form>
    </div>
  );
}
