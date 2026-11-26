import { useState } from 'react';
import { Plus, SearchX, ReceiptText } from 'lucide-react';
import type { Transaction, TransactionFilters as Filters } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { useLiveQuery } from '@/hooks/useLiveQuery';
import { useSettings } from '@/hooks/useSettings';
import { deleteTransaction, getTransactions } from '@/services/database/transactionService';
import { toAppError } from '@/utils/errors';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Spinner } from '@/components/common/Spinner';
import { useToast } from '@/components/common/ToastProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionList } from '@/components/transactions/TransactionList';

interface TransactionsProps {
  onAdd: () => void;
  onEdit: (transaction: Transaction) => void;
}

const DEFAULT_FILTERS: Filters = { type: 'all', category: 'all', search: '' };

export function Transactions({ onAdd, onEdit }: TransactionsProps) {
  const { settings } = useSettings();
  const { categories, byId } = useCategories();
  const { showToast } = useToast();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [toDelete, setToDelete] = useState<Transaction | null>(null);

  const { data, loading, error } = useLiveQuery(
    () => getTransactions(filters),
    [filters.type, filters.category, filters.search],
  );

  const transactions = data ?? [];
  const hasActiveFilters =
    filters.type !== 'all' || filters.category !== 'all' || filters.search.trim() !== '';

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteTransaction(toDelete.id);
      showToast('Movimiento eliminado.', 'success');
    } catch (err) {
      showToast(toAppError(err).message, 'error');
    } finally {
      setToDelete(null);
    }
  };

  const addButton = (
    <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={onAdd}>
      Agregar movimiento
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Movimientos"
        subtitle={data ? `${transactions.length} resultado(s)` : undefined}
        actions={addButton}
      />

      <div className="space-y-4">
        <TransactionFilters filters={filters} categories={categories} onChange={setFilters} />

        <Card>
          {error && <ErrorMessage message={error.message} />}
          {loading && !data && <Spinner />}

          {data && transactions.length === 0 && (
            hasActiveFilters ? (
              <EmptyState
                icon={SearchX}
                title="Sin resultados"
                description="Ningún movimiento coincide con los filtros actuales."
                action={
                  <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                    Limpiar filtros
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={ReceiptText}
                title="Todavía no tienes movimientos"
                description="Registra tu primer ingreso o egreso para empezar."
                action={addButton}
              />
            )
          )}

          {transactions.length > 0 && (
            <TransactionList
              transactions={transactions}
              categoriesById={byId}
              currency={settings.baseCurrency}
              onEdit={onEdit}
              onDelete={setToDelete}
            />
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar movimiento"
        message={`¿Seguro que deseas eliminar "${toDelete?.description ?? ''}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
