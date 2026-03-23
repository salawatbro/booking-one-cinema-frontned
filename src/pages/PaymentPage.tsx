import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/lib/utils';
import { hapticImpact } from '@/lib/haptic';
import { useInitiatePayment, usePaymentStatus } from '@/hooks/useApi';
import { useIsDesktop } from '@/hooks/useIsDesktop';

const PAYMENT_TIMEOUT = 15 * 60;

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const totalPrice: number = location.state?.totalPrice || 0;
  const bookingId: number = location.state?.bookingId || 0;
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [expired, setExpired] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const initiatePayment = useInitiatePayment();
  const { data: paymentStatus } = usePaymentStatus(bookingId, paymentInitiated);

  useEffect(() => {
    if (paymentStatus?.status === 'paid') {
      navigate('/booking-success', { state: { bookingId, ticketCode: paymentStatus.ticket_code } });
    }
  }, [paymentStatus, navigate, bookingId]);

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

  const handlePayment = (provider: 'click' | 'payme') => {
    hapticImpact('medium');
    initiatePayment.mutate(
      { bookingId, provider, returnUrl: window.location.origin + '/booking-success' },
      {
        onSuccess: (data) => {
          setPaymentInitiated(true);
          if (data.payment_url) {
            window.open(data.payment_url, '_blank');
          }
        },
      },
    );
  };

  if (expired) {
    return (
      <div className="flex flex-col items-center justify-center text-center" style={{ padding: '0 32px', minHeight: 'calc(100vh - 200px)' }}>
        <div className="flex items-center justify-center bg-danger-light" style={{ width: 64, height: 64, borderRadius: 32 }}>
          <AlertTriangle size={28} className="text-danger" />
        </div>
        <h1 className="text-[20px] font-bold text-text-primary" style={{ marginTop: 20 }}>{t('payment.expired')}</h1>
        <p className="text-[13px] text-text-secondary leading-relaxed" style={{ marginTop: 8, maxWidth: 280 }}>{t('payment.expiredMessage')}</p>
        <div className="flex flex-col" style={{ marginTop: 32, gap: 8, width: '100%', maxWidth: 320 }}>
          <button onClick={() => navigate('/')} className="w-full bg-accent text-white text-[14px] font-semibold active:opacity-80 transition-opacity" style={{ height: 48, borderRadius: 8 }}>{t('payment.goHome')}</button>
          <button onClick={() => navigate('/bookings')} className="w-full bg-bg-secondary text-text-primary text-[14px] font-semibold active:opacity-80 transition-opacity" style={{ height: 48, borderRadius: 8 }}>{t('payment.myBookings')}</button>
        </div>
      </div>
    );
  }

  const content = (
    <>
      {/* Timer */}
      <div className="flex flex-col items-center" style={{ padding: '32px 16px 0' }}>
        <div className="flex items-center gap-2">
          <Clock size={18} className={isUrgent ? 'text-danger' : 'text-text-tertiary'} />
          <span className={`text-[28px] font-bold tabular-nums ${isUrgent ? 'text-danger' : 'text-text-primary'}`}>{timeStr}</span>
        </div>
        <p className="text-[12px] text-text-tertiary" style={{ marginTop: 6 }}>{t('payment.timeLeft')}</p>
      </div>

      {/* Amount */}
      <div className="flex flex-col items-center" style={{ marginTop: 24 }}>
        <p className="text-[12px] text-text-tertiary">{t('payment.amount')}</p>
        <p className="text-[28px] font-bold text-text-primary" style={{ marginTop: 4 }}>{formatPrice(totalPrice)}</p>
      </div>

      <div className="border-t border-border" style={{ margin: '24px 16px' }} />

      {/* Payment methods */}
      <div style={{ padding: '0 16px' }}>
        <p className="text-[12px] font-semibold text-text-secondary" style={{ marginBottom: 12 }}>{t('payment.selectMethod')}</p>
        <div className={isDesktop ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2'}>
          {[
            { name: 'Click', provider: 'click' as const, color: '#00b4ff', desc: t('payment.clickPay') },
            { name: 'Payme', provider: 'payme' as const, color: '#2ebf6a', desc: t('payment.paymePay') },
          ].map((method) => (
            <button
              key={method.name}
              onClick={() => handlePayment(method.provider)}
              disabled={initiatePayment.isPending}
              className="flex items-center border border-border bg-bg-card active:opacity-70 transition-opacity disabled:opacity-50"
              style={{ padding: '14px 16px', borderRadius: 8, gap: 12 }}
            >
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

      {initiatePayment.isError && (
        <div className="bg-danger-light" style={{ margin: '16px 16px 0', padding: '12px 14px', borderRadius: 8 }}>
          <p className="text-[12px] text-danger">Error: {initiatePayment.error.message}</p>
        </div>
      )}

      <div className="flex items-start gap-2 bg-warning-light" style={{ margin: '20px 16px 0', padding: '12px 14px', borderRadius: 8 }}>
        <AlertTriangle size={16} className="text-warning flex-shrink-0" style={{ marginTop: 1 }} />
        <p className="text-[12px] text-text-secondary leading-relaxed">{t('payment.warning')}</p>
      </div>
    </>
  );

  // Desktop: centered card
  if (isDesktop) {
    return (
      <div style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', padding: '24px 0 24px' }}>
        <div className="flex items-center justify-center" style={{ height: 56 }}>
          <h1 className="text-[18px] font-bold text-text-primary">{t('payment.title')}</h1>
        </div>
        <div className="border border-border bg-bg-card" style={{ borderRadius: 8, paddingBottom: 24 }}>
          {content}
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="flex items-center justify-center border-b border-border" style={{ height: 56 }}>
        <h1 className="text-[15px] font-semibold text-text-primary">{t('payment.title')}</h1>
      </div>
      {content}
    </div>
  );
}
