import { DEFAULT_LOCALE } from './constants';

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'currency', currency }).format(amount);
  } catch {
    // Código de moneda inválido: mostrar número simple
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/** Fecha local YYYY-MM-DD de hoy (sin desfases por zona horaria). */
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Convierte YYYY-MM-DD a Date local (evita interpretarla como UTC). */
export function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? date : null;
}

export function formatDate(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
