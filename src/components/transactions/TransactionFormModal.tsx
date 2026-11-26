import type { Transaction } from '@/types';
import { Modal } from '@/components/common/Modal';
import { TransactionForm } from './TransactionForm';

interface TransactionFormModalProps {
  open: boolean;
  /** undefined = alta de movimiento nuevo */
  transaction?: Transaction;
  currency: string;
  onSaved: (transaction: Transaction, mode: 'created' | 'updated') => void;
  onClose: () => void;
}

export function TransactionFormModal({
  open,
  transaction,
  currency,
  onSaved,
  onClose,
}: TransactionFormModalProps) {
  return (
    <Modal open={open} title={transaction ? 'Editar movimiento' : 'Nuevo movimiento'} onClose={onClose}>
      {/* key: reinicia el formulario al cambiar de movimiento */}
      <TransactionForm
        key={transaction?.id ?? 'new'}
        transaction={transaction}
        currency={currency}
        onSaved={onSaved}
        onCancel={onClose}
      />
    </Modal>
  );
}
