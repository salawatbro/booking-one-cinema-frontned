import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/lib/utils';
import { hapticImpact } from '@/lib/haptic';

const PAYMENT_TIMEOUT = 15 * 60;

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const totalPrice: number = location.state?.totalPrice || 0;
  const bookingId: number = location.state?.bookingId || 0;
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setExpired(true); return; }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setExpired(true); clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = timeLeft < 120;

  if (expired) {
    return (
      <div className="flex flex-col items-center justify-center text-center" style={{ padding: '0 32px', height: 'calc(100dvh - env(safe-area-inset-top, 0px) - 150px)' }}>
        <div className="flex items-center justify-center bg-danger-light" style={{ width: 64, height: 64, borderRadius: 32 }}>
          <AlertTriangle size={28} className="text-danger" />
        </div>
        <h1 className="text-[20px] font-bold text-text-primary" style={{ marginTop: 20 }}>{t('payment.expired')}</h1>
        <p className="text-[13px] text-text-secondary leading-relaxed" style={{ marginTop: 8, maxWidth: 280 }}>{t('payment.expiredMessage')}</p>
        <div className="w-full flex flex-col" style={{ marginTop: 32, gap: 8 }}>
          <button onClick={() => navigate('/')} className="w-full bg-accent text-white text-[14px] font-semibold active:opacity-80 transition-opacity" style={{ height: 48, borderRadius: 8 }}>{t('payment.goHome')}</button>
          <button onClick={() => navigate('/bookings')} className="w-full bg-bg-secondary text-text-primary text-[14px] font-semibold active:opacity-80 transition-opacity" style={{ height: 48, borderRadius: 8 }}>{t('payment.myBookings')}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="flex items-center justify-center border-b border-border" style={{ height: 56 }}>
        <h1 className="text-[15px] font-semibold text-text-primary">{t('payment.title')}</h1>
      </div>

      <div className="flex flex-col items-center" style={{ padding: '32px 16px 0' }}>
        <div className="flex items-center gap-2">
          <Clock size={18} className={isUrgent ? 'text-danger' : 'text-text-tertiary'} />
          <span className={`text-[28px] font-bold tabular-nums ${isUrgent ? 'text-danger' : 'text-text-primary'}`}>{timeStr}</span>
        </div>
        <p className="text-[12px] text-text-tertiary" style={{ marginTop: 6 }}>{t('payment.timeLeft')}</p>
      </div>

      <div className="flex flex-col items-center" style={{ marginTop: 24 }}>
        <p className="text-[12px] text-text-tertiary">{t('payment.amount')}</p>
        <p className="text-[28px] font-bold text-text-primary" style={{ marginTop: 4 }}>{formatPrice(totalPrice)}</p>
      </div>

      <div className="border-t border-border" style={{ margin: '24px 16px' }} />

      <div style={{ padding: '0 16px' }}>
        <p className="text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 12 }}>{t('payment.selectMethod')}</p>
        <div className="flex flex-col" style={{ gap: 8 }}>
          {[
            { name: 'Click', color: '#00b4ff', desc: t('payment.clickPay') },
            { name: 'Payme', color: '#2ebf6a', desc: t('payment.paymePay') },
          ].map((method) => (
            <button key={method.name} onClick={() => { hapticImpact('medium'); navigate('/booking-success', { state: { bookingId } }); }} className="flex items-center border border-border bg-bg-card active:opacity-70 transition-opacity" style={{ padding: '14px 16px', borderRadius: 8, gap: 12 }}>
              <div className="flex items-center justify-center text-white font-bold text-[12px]" style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: method.color }}>{method.name}</div>
              <div className="flex-1 text-left">
                <span className="text-[14px] font-semibold text-text-primary">{method.name}</span>
                <p className="text-[11px] text-text-tertiary">{method.desc}</p>
              </div>
              <CreditCard size={18} className="text-text-tertiary" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 bg-warning-light" style={{ margin: '20px 16px 0', padding: '12px 14px', borderRadius: 8 }}>
        <AlertTriangle size={16} className="text-warning flex-shrink-0" style={{ marginTop: 1 }} />
        <p className="text-[12px] text-text-secondary leading-relaxed">{t('payment.warning')}</p>
      </div>
    </div>
  );
}
