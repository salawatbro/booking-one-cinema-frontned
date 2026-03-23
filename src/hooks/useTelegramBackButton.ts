import { useEffect, useRef } from 'react';

export function useTelegramBackButton(onBack: () => void): { isAvailable: boolean } {
  const callbackRef = useRef(onBack);
  callbackRef.current = onBack;

  const stableHandler = useRef(() => {
    callbackRef.current();
  });

  const isAvailable = !!window.Telegram?.WebApp?.BackButton;

  useEffect(() => {
    const backButton = window.Telegram?.WebApp?.BackButton;
    if (!backButton) return;

    backButton.onClick(stableHandler.current);
    backButton.show();

    return () => {
      backButton.offClick(stableHandler.current);
      backButton.hide();
    };
  }, []);

  return { isAvailable };
}
