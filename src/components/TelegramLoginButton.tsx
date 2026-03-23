import { useEffect, useRef } from 'react';
import type { TelegramLoginData } from '@/hooks/useAuth';

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (data: TelegramLoginData) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: 'write';
}

export function TelegramLoginButton({
  botName,
  onAuth,
  buttonSize = 'medium',
  cornerRadius = 8,
  requestAccess = 'write',
}: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callbackName = `__tg_login_${Date.now()}`;

    (window as unknown as Record<string, unknown>)[callbackName] = (data: TelegramLoginData) => {
      onAuth(data);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', String(cornerRadius));
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    script.setAttribute('data-request-access', requestAccess);

    const container = containerRef.current;
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      if (container) container.innerHTML = '';
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess]);

  return <div ref={containerRef} />;
}
