import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
}

export function formatDateFull(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}s ${m}d`;
}

const monthNames: Record<number, string> = {
  0: 'Yanvar', 1: 'Fevral', 2: 'Mart', 3: 'Aprel',
  4: 'May', 5: 'Iyun', 6: 'Iyul', 7: 'Avgust',
  8: 'Sentabr', 9: 'Oktabr', 10: 'Noyabr', 11: 'Dekabr',
};

export function getMonthName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return monthNames[date.getMonth()];
}

export function getDayNumber(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.getDate().toString();
}

const dayNames: Record<number, string> = {
  0: 'Yak', 1: 'Dush', 2: 'Sesh', 3: 'Chor', 4: 'Pay', 5: 'Jum', 6: 'Shan',
};

export function getDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return dayNames[date.getDay()];
}
