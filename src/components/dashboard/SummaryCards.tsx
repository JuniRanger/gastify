import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import type { Summary } from '@/types';
import { formatCurrency } from '@/utils/format';

interface SummaryCardsProps {
  summary: Summary;
  currency: string;
}

export function SummaryCards({ summary, currency }: SummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl bg-brand-600 p-5 text-white shadow-card sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 text-sm text-brand-100">
          <Wallet className="h-4 w-4" aria-hidden />
          Balance disponible
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight">
          {formatCurrency(summary.balance, currency)}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ArrowUpCircle className="h-4 w-4 text-brand-600" aria-hidden />
          Total de ingresos
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatCurrency(summary.income, currency)}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ArrowDownCircle className="h-4 w-4 text-red-500" aria-hidden />
          Total de egresos
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatCurrency(summary.expense, currency)}
        </p>
      </div>
    </div>
  );
}
