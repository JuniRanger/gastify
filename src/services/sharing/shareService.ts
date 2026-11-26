import type { CategoryTotal, Summary } from '@/types';
import { formatCurrency, formatDate, todayISO } from '@/utils/format';

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'unavailable';

export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/** Genera el texto plano del resumen financiero que se comparte. */
export function buildSummaryText(
  summary: Summary,
  currency: string,
  topExpenses: readonly CategoryTotal[],
): string {
  const lines = [
    'Resumen financiero - Gastify',
    `Fecha: ${formatDate(todayISO())}`,
    '',
    `Balance: ${formatCurrency(summary.balance, currency)}`,
    `Ingresos: ${formatCurrency(summary.income, currency)}`,
    `Egresos: ${formatCurrency(summary.expense, currency)}`,
  ];

  if (topExpenses.length > 0) {
    lines.push('', 'Principales gastos:');
    for (const item of topExpenses.slice(0, 3)) {
      lines.push(`- ${item.name}: ${formatCurrency(item.total, currency)}`);
    }
  }
  return lines.join('\n');
}

/**
 * Comparte el resumen con Web Share API. Si no existe, intenta copiarlo al portapapeles.
 * Devuelve 'unavailable' cuando ninguna opción funciona (la UI debe mostrar el texto).
 */
export async function shareSummary(text: string): Promise<ShareResult> {
  if (isWebShareSupported()) {
    try {
      await navigator.share({ title: 'Resumen financiero - Gastify', text });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      // Otro fallo (p. ej. NotAllowedError): se intenta el fallback
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return 'copied';
    } catch {
      // Permiso denegado o contexto inseguro
    }
  }
  return 'unavailable';
}
