import type { Category, Transaction } from '@/types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: readonly Transaction[];
  categoriesById: ReadonlyMap<string, Category>;
  currency: string;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionList({
  transactions,
  categoriesById,
  currency,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <ul className="divide-y divide-slate-100">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          category={categoriesById.get(transaction.category)}
          currency={currency}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
