import { Pencil, Trash2 } from 'lucide-react';
import type { Category, Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { getCategoryIcon } from '@/utils/icons';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  currency: string;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  category,
  currency,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const Icon = getCategoryIcon(category?.icon ?? '');
  const color = category?.color ?? '#94a3b8';
  const isIncome = transaction.type === 'income';

  return (
    <li className="flex items-center gap-3 py-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{transaction.description}</p>
        <p className="truncate text-xs text-slate-500">
          {category?.name ?? 'Sin categoría'} · {formatDate(transaction.date)}
        </p>
      </div>

      <p className={`shrink-0 text-sm font-semibold ${isIncome ? 'text-brand-700' : 'text-slate-900'}`}>
        {isIncome ? '+' : '−'}
        {formatCurrency(transaction.amount, currency)}
      </p>

      {(onEdit || onDelete) && (
        <div className="flex shrink-0 gap-0.5">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              aria-label={`Editar ${transaction.description}`}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(transaction)}
              aria-label={`Eliminar ${transaction.description}`}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
