import { clsx, type ClassValue } from 'clsx';
import i18n from '@/lib/i18n';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' ' + i18n.t('common.currency');
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const day = date.getDate();
  const month = i18n.t(`months.${date.getMonth()}`);
  return `${day} ${month}`;
}

export function formatDateFull(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const day = date.getDate();
  const month = i18n.t(`months.${date.getMonth()}`);
  return `${day} ${month}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}${i18n.t('common.hour')} ${m}${i18n.t('common.minute')}`;
}

export function getMonthName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const key = `months.${date.getMonth()}`;
  return i18n.t(key);
}

export function getDayNumber(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.getDate().toString();
}

export function getDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const key = `days.${date.getDay()}`;
  return i18n.t(key);
}
