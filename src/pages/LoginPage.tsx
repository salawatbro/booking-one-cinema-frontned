import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth, type TelegramLoginData } from '@/hooks/useAuth';
import { TelegramLoginButton } from '@/components/TelegramLoginButton';

const BOT_NAME = import.meta.env.VITE_TELEGRAM_BOT_NAME;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  const handleAuth = useCallback(async (data: TelegramLoginData) => {
    setError(null);
    setLoading(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [login, navigate, from]);

  // Handle redirect callback (query params)
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return;
    }
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');
    if (id && hash) {
      handleAuth({
        id: Number(id),
        first_name: searchParams.get('first_name') || '',
        last_name: searchParams.get('last_name') || undefined,
        username: searchParams.get('username') || undefined,
        photo_url: searchParams.get('photo_url') || undefined,
        auth_date: Number(searchParams.get('auth_date') || 0),
        hash,
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 180px)', padding: '0 24px' }}>
      <div className="flex items-center justify-center bg-accent/10 text-accent" style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 20 }}>
        <Send size={28} />
      </div>

      <h1 className="text-[20px] font-bold text-text-primary text-center">
        {t('auth.loginTitle')}
      </h1>
      <p className="text-[13px] text-text-secondary text-center" style={{ marginTop: 8, maxWidth: 280 }}>
        {t('auth.loginDescription')}
      </p>

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div className="text-[13px] text-text-tertiary">{t('auth.loggingIn')}</div>
        ) : (
          <TelegramLoginButton botName={BOT_NAME} onAuth={handleAuth} buttonSize="large" />
        )}
      </div>

      {error && (
        <div className="bg-danger-light text-danger text-[12px]" style={{ marginTop: 16, padding: '10px 16px', borderRadius: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}
