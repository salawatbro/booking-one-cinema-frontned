function getHaptic(): TelegramWebApp['HapticFeedback'] | null {
  try {
    return window.Telegram?.WebApp?.HapticFeedback ?? null;
  } catch {
    return null;
  }
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy'): void {
  try { getHaptic()?.impactOccurred(style); } catch { /* unsupported */ }
}

export function hapticNotification(type: 'success' | 'error' | 'warning'): void {
  try { getHaptic()?.notificationOccurred(type); } catch { /* unsupported */ }
}

export function hapticSelection(): void {
  try { getHaptic()?.selectionChanged(); } catch { /* unsupported */ }
}
