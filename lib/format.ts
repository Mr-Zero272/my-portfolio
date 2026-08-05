// src/utils/date.ts
import { format, formatDistanceToNow, isAfter, isBefore, isValid, parseISO } from 'date-fns';
// import { vi } from 'date-fns/locale';

type DateInput = Date | string | number | null | undefined;

const DEFAULT_FALLBACK = '--';

export const DATE_FORMATS = {
  date: 'MM/dd/yyyy',
  dateTime: 'MM/dd/yyyy HH:mm',
  longDateTime: 'PPP HH:mm',
  time: 'HH:mm',
  inputDate: 'yyyy-MM-dd',
  monthYear: 'MM/yyyy',
  fullDate: 'MMM, dd yyyy',
} as const;

export type DateFormatKey = keyof typeof DATE_FORMATS;

export function toDate(value: DateInput): Date | null {
  if (!value) return null;

  const date = typeof value === 'string' ? parseISO(value) : new Date(value);

  return isValid(date) ? date : null;
}

export function formatDate(
  value: DateInput,
  pattern: DateFormatKey | string = 'date',
  fallback = DEFAULT_FALLBACK,
): string {
  const date = toDate(value);
  if (!date || date.getTime() === 0) return fallback;

  const resolvedPattern =
    pattern in DATE_FORMATS ? DATE_FORMATS[pattern as DateFormatKey] : pattern;

  return format(date, resolvedPattern);
}

export function formatDateTime(value: DateInput, fallback?: string): string {
  return formatDate(value, 'dateTime', fallback);
}

export function formatTime(value: DateInput, fallback?: string): string {
  return formatDate(value, 'time', fallback);
}

export function formatRelativeTime(value: DateInput, fallback = DEFAULT_FALLBACK): string {
  const date = toDate(value);
  if (!date) return fallback;

  return formatDistanceToNow(date, {
    addSuffix: true,
    // locale: vi,
  });
}

export function isPastDate(value: DateInput): boolean {
  const date = toDate(value);
  return date ? isBefore(date, new Date()) : false;
}

export function isFutureDate(value: DateInput): boolean {
  const date = toDate(value);
  return date ? isAfter(date, new Date()) : false;
}

export function isToday(value: DateInput): boolean {
  const date = toDate(value);
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

// ─── File Size ──────────────────────────────────────────────────────────────

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** Format a byte count into a human-readable string, e.g. `"1.8 MB"`. */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  const size = bytes / Math.pow(1024, i);
  const decimals = i === 0 ? 0 : 1;
  return `${size.toFixed(decimals)} ${SIZE_UNITS[i]}`;
}
