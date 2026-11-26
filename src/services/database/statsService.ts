import type { CategoryTotal, Summary } from '@/types';
import { roundMoney } from '@/utils/format';
import { db } from './db';
import { runDb } from './runDb';

export function getSummary(): Promise<Summary> {
  return runDb('getSummary', 'No se pudo calcular el balance.', async () => {
    let income = 0;
    let expense = 0;
    let count = 0;

    await db.transactions.each((t) => {
      count += 1;
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    return {
      income: roundMoney(income),
      expense: roundMoney(expense),
      balance: roundMoney(income - expense),
      count,
    };
  });
}

/** Total de egresos agrupado por categoría, de mayor a menor. */
export function getExpensesByCategory(): Promise<CategoryTotal[]> {
  return runDb('getExpensesByCategory', 'No se pudieron calcular las estadísticas.', async () => {
    const categories = await db.categories.toArray();
    const byId = new Map(categories.map((c) => [c.id, c]));
    const totals = new Map<string, number>();

    await db.transactions
      .where('type')
      .equals('expense')
      .each((t) => {
        totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
      });

    return [...totals.entries()]
      .map(([categoryId, total]) => {
        const category = byId.get(categoryId);
        return {
          categoryId,
          name: category?.name ?? 'Sin categoría',
          color: category?.color ?? '#94a3b8',
          total: roundMoney(total),
        };
      })
      .sort((a, b) => b.total - a.total);
  });
}
