function getHaptic(): TelegramWebApp['HapticFeedback'] | null {
  try {
    return window.Telegram?.WebApp?.HapticFeedback ?? null;
  } catch {
    return null;
  }
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy'): void {
  getHaptic()?.impactOccurred(style);
}

export function hapticNotification(type: 'success' | 'error' | 'warning'): void {
  getHaptic()?.notificationOccurred(type);
}

export function hapticSelection(): void {
  getHaptic()?.selectionChanged();
}
