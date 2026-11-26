import type { Category, TransactionType } from '@/types';
import { db } from './db';
import { runDb } from './runDb';

export function getCategories(type?: TransactionType): Promise<Category[]> {
  return runDb('getCategories', 'No se pudieron cargar las categorías.', async () => {
    const all = await db.categories.toArray();
    return type ? all.filter((c) => c.type === type) : all;
  });
}
