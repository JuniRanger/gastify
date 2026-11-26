import type { Category, TransactionInput, TransactionType } from '@/types';
import { DESCRIPTION_MAX, MAX_AMOUNT, NOTES_MAX } from './constants';
import { parseISODate } from './format';

/** Valores del formulario tal como los escribe el usuario (todo texto). */
export interface TransactionFormValues {
  description: string;
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
  notes: string;
}

export type FormErrors = Partial<Record<keyof TransactionFormValues, string>>;

export const AMOUNT_ERROR =
  'Ingresa un importe positivo, mayor a 0, con máximo 2 decimales (ej. 150.50).';

/**
 * Convierte el texto del importe a número.
 * Rechaza negativos, notaciones científicas, letras y más de 2 decimales.
 */
export function parseAmount(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0 || value > MAX_AMOUNT) return null;
  return value;
}

function hasAtMostTwoDecimals(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;
}

/** Validación del modelo ya tipado. Se usa en el formulario y en la capa de servicios. */
export function validateTransactionInput(
  input: TransactionInput,
  categories: readonly Category[],
): FormErrors {
  const errors: FormErrors = {};

  const description = input.description.trim();
  if (description.length === 0) {
    errors.description = 'La descripción es obligatoria.';
  } else if (description.length > DESCRIPTION_MAX) {
    errors.description = `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`;
  }

  if (
    typeof input.amount !== 'number' ||
    !Number.isFinite(input.amount) ||
    input.amount <= 0 ||
    input.amount > MAX_AMOUNT ||
    !hasAtMostTwoDecimals(input.amount)
  ) {
    errors.amount = AMOUNT_ERROR;
  }

  if (input.type !== 'income' && input.type !== 'expense') {
    errors.type = 'Selecciona un tipo de movimiento.';
  }

  const category = categories.find((c) => c.id === input.category);
  if (!category) {
    errors.category = 'Selecciona una categoría.';
  } else if (category.type !== input.type) {
    errors.category = 'La categoría no corresponde al tipo de movimiento.';
  }

  if (!parseISODate(input.date)) {
    errors.date = 'Ingresa una fecha válida.';
  }

  if (input.notes && input.notes.length > NOTES_MAX) {
    errors.notes = `Las notas no pueden superar ${NOTES_MAX} caracteres.`;
  }

  return errors;
}

export function validateTransactionForm(
  values: TransactionFormValues,
  categories: readonly Category[],
): { errors: FormErrors; data?: TransactionInput } {
  const parsedAmount = parseAmount(values.amount);

  const input: TransactionInput = {
    description: values.description.trim(),
    amount: parsedAmount ?? 0,
    type: values.type,
    category: values.category,
    date: values.date,
    notes: values.notes.trim() || undefined,
  };

  const errors = validateTransactionInput(input, categories);
  if (parsedAmount === null) errors.amount = AMOUNT_ERROR;

  const isValid = Object.keys(errors).length === 0;
  return isValid ? { errors, data: input } : { errors };
}
