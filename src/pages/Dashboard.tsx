import { Plus, ReceiptText } from 'lucide-react';
import type { Transaction } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { useLiveQuery } from '@/hooks/useLiveQuery';
import { useSettings } from '@/hooks/useSettings';
import { getRecentTransactions } from '@/services/database/transactionService';
import { getExpensesByCategory, getSummary } from '@/services/database/statsService';
import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Spinner } from '@/components/common/Spinner';
import { ShareSummaryButton } from '@/components/dashboard/ShareSummaryButton';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionList } from '@/components/transactions/TransactionList';

interface DashboardProps {
  onAdd: () => void;
  onEdit: (transaction: Transaction) => void;
}

export function Dashboard({ onAdd }: DashboardProps) {
  const { settings } = useSettings();
  const { byId } = useCategories();
  const summaryQuery = useLiveQuery(() => getSummary(), []);
  const expensesQuery = useLiveQuery(() => getExpensesByCategory(), []);
  const recentQuery = useLiveQuery(() => getRecentTransactions(5), []);

  const currency = settings.baseCurrency;
  const summary = summaryQuery.data;
  const expenses = expensesQuery.data ?? [];
  const recent = recentQuery.data ?? [];

  const addButton = (
    <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={onAdd}>
      Agregar movimiento
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Resumen"
        subtitle="Tu situación financiera de un vistazo"
        actions={
          <>
            {summary && (
              <ShareSummaryButton summary={summary} topExpenses={expenses} currency={currency} />
            )}
            {addButton}
          </>
        }
      />

      {summaryQuery.error && <ErrorMessage message={summaryQuery.error.message} />}
      {summaryQuery.loading && !summary && <Spinner />}

      {summary && (
        <div className="space-y-4">
          <SummaryCards summary={summary} currency={currency} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Gastos por categoría">
              {expensesQuery.error ? (
                <ErrorMessage message={expensesQuery.error.message} />
              ) : (
                <ExpensesByCategoryChart data={expenses} currency={currency} />
              )}
            </Card>

            <Card
              title="Movimientos recientes"
              action={
                recent.length > 0 ? (
                  <a href="#/transactions" className="text-sm font-medium text-brand-700 hover:underline">
                    Ver todos
                  </a>
                ) : undefined
              }
            >
              {recentQuery.error ? (
                <ErrorMessage message={recentQuery.error.message} />
              ) : recent.length === 0 ? (
                <EmptyState
                  icon={ReceiptText}
                  title="Todavía no tienes movimientos"
                  description="Registra tu primer ingreso o egreso para empezar."
                  action={addButton}
                />
              ) : (
                <TransactionList transactions={recent} categoriesById={byId} currency={currency} />
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
