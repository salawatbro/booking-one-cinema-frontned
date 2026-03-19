declare global {
  interface TelegramWebApp {
    ready(): void;
    expand(): void;
    close(): void;
    requestFullscreen(): void;
    isExpanded: boolean;
    isFullscreen: boolean;
    disableVerticalSwipes(): void;
    enableVerticalSwipes(): void;
    MainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isActive: boolean;
      isProgressVisible: boolean;
      setText(text: string): void;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
      show(): void;
      hide(): void;
      enable(): void;
      disable(): void;
      showProgress(leaveActive?: boolean): void;
      hideProgress(): void;
      setParams(params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }): void;
    };
    BackButton: {
      isVisible: boolean;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
      show(): void;
      hide(): void;
    };
    CloudStorage: {
      setItem(key: string, value: string, callback?: (error: string | null, success?: boolean) => void): void;
      getItem(key: string, callback: (error: string | null, value?: string) => void): void;
      getItems(keys: string[], callback: (error: string | null, values?: Record<string, string>) => void): void;
      removeItem(key: string, callback?: (error: string | null) => void): void;
      getKeys(callback: (error: string | null, keys?: string[]) => void): void;
    };
    HapticFeedback: {
      impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
      notificationOccurred(type: 'error' | 'success' | 'warning'): void;
      selectionChanged(): void;
    };
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export {};
