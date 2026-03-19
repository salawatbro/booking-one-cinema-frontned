import { useEffect, useRef } from 'react';

export function useTelegramBackButton(onBack: () => void): void {
  const callbackRef = useRef(onBack);
  callbackRef.current = onBack;

  const stableHandler = useRef(() => {
    callbackRef.current();
  });

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
}
