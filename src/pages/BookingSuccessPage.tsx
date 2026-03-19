import { useNavigate, useLocation } from 'react-router-dom';
import { CircleCheck, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const ticketCode: string = location.state?.ticketCode || '';

  return (
    <div className="flex flex-col bg-bg" style={{ height: 'calc(100dvh - env(safe-area-inset-top, 0px) - 150px)' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '0 32px' }}>
        <div className="flex items-center justify-center bg-success-light" style={{ width: 72, height: 72, borderRadius: 36 }}>
          <CircleCheck size={36} className="text-success" />
        </div>
        <h1 className="text-[22px] font-bold text-text-primary" style={{ marginTop: 20 }}>{t('success.title')}</h1>
        <p className="text-[13px] text-text-secondary leading-relaxed" style={{ marginTop: 8, maxWidth: 280 }}>{t('success.message')}</p>
        <div className="w-full bg-bg-secondary border border-border flex flex-col items-center" style={{ marginTop: 24, padding: '16px 0', borderRadius: 8 }}>
          <p className="text-[11px] text-text-tertiary uppercase tracking-wider">{t('success.ticketCode')}</p>
          <p className="text-[20px] font-bold text-text-primary tracking-widest" style={{ marginTop: 4 }}>{ticketCode}</p>
        </div>
      </div>
      <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => navigate('/bookings')} className="w-full bg-accent text-white text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity" style={{ height: 48, borderRadius: 8 }}>
          <Ticket size={16} /> {t('bookings.viewBookings')}
        </button>
        {/* TODO: enable when download API is ready
        <button
          onClick={() => bookingId && downloadTicket(bookingId).catch(() => {})}
          className="w-full border border-border text-text-primary text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
          style={{ height: 48, borderRadius: 8 }}
        >
          <Download size={16} /> {t('success.downloadTicket')}
        </button>
        */}
      </div>
    </div>
  );
}
