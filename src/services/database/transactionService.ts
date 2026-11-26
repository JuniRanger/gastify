import type { Transaction, TransactionFilters, TransactionInput } from '@/types';
import { AppError } from '@/utils/errors';
import { validateTransactionInput } from '@/utils/validation';
import { db } from './db';
import { runDb } from './runDb';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Defensa en profundidad: la capa de datos también valida, no solo el formulario. */
async function assertValidInput(input: TransactionInput): Promise<void> {
  const categories = await db.categories.toArray();
  const errors = validateTransactionInput(input, categories);
  const firstError = Object.values(errors)[0];
  if (firstError) throw new AppError(firstError, 'VALIDATION');
}

export function createTransaction(input: TransactionInput): Promise<Transaction> {
  return runDb('createTransaction', 'No se pudo guardar el movimiento.', async () => {
    await assertValidInput(input);
    const now = Date.now();
    const transaction: Transaction = {
      ...input,
      description: input.description.trim(),
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.transactions.add(transaction);
    return transaction;
  });
}

export function getTransactionById(id: string): Promise<Transaction | undefined> {
  return runDb('getTransactionById', 'No se pudo cargar el movimiento.', () =>
    db.transactions.get(id),
  );
}

function sortNewestFirst(items: Transaction[]): Transaction[] {
  return items.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

export function getTransactions(
  filters?: Partial<TransactionFilters>,
): Promise<Transaction[]> {
  return runDb('getTransactions', 'No se pudieron cargar los movimientos.', async () => {
    const search = filters?.search?.trim().toLowerCase() ?? '';
    const items = await db.transactions.toArray();

    const filtered = items.filter((t) => {
      if (filters?.type && filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters?.category && filters.category !== 'all' && t.category !== filters.category) {
        return false;
      }
      if (search) {
        const haystack = `${t.description} ${t.notes ?? ''}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });

    return sortNewestFirst(filtered);
  });
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const all = await getTransactions();
  return all.slice(0, limit);
}

export function updateTransaction(id: string, input: TransactionInput): Promise<Transaction> {
  return runDb('updateTransaction', 'No se pudo actualizar el movimiento.', async () => {
    const existing = await db.transactions.get(id);
    if (!existing) throw new AppError('El movimiento ya no existe.', 'NOT_FOUND');
    await assertValidInput(input);

    const updated: Transaction = {
      id: existing.id,
      createdAt: existing.createdAt,
      description: input.description.trim(),
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: input.date,
      notes: input.notes,
      updatedAt: Date.now(),
    };
    await db.transactions.put(updated);
    return updated;
  });
}

export function deleteTransaction(id: string): Promise<void> {
  return runDb('deleteTransaction', 'No se pudo eliminar el movimiento.', () =>
    db.transactions.delete(id),
  );
}
