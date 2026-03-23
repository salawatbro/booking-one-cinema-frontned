import { useEffect, useRef } from 'react';

interface MainButtonOptions {
  text: string;
  onClick: () => void;
  visible?: boolean;
  isLoading?: boolean;
  color?: string;
  textColor?: string;
}

export function useTelegramMainButton({ text, onClick, visible = true, isLoading = false, color, textColor }: MainButtonOptions): { isAvailable: boolean } {
  const callbackRef = useRef(onClick);
  callbackRef.current = onClick;

  const stableHandler = useRef(() => {
    callbackRef.current();
  });

  const isAvailable = !!window.Telegram?.WebApp?.MainButton;

  useEffect(() => {
    const mainButton = window.Telegram?.WebApp?.MainButton;
    if (!mainButton) return;

    mainButton.setParams({
      text,
      ...(color ? { color } : {}),
      ...(textColor ? { text_color: textColor } : {}),
    });

    if (isLoading) {
      mainButton.showProgress(true);
    } else {
      mainButton.hideProgress();
    }

    if (visible) {
      mainButton.show();
    } else {
      mainButton.hide();
    }

    mainButton.onClick(stableHandler.current);

    return () => {
      mainButton.offClick(stableHandler.current);
      mainButton.hide();
      mainButton.hideProgress();
    };
  }, [text, visible, isLoading, color, textColor]);

  return { isAvailable };
}
