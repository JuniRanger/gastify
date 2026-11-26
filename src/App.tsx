import { useCallback, useState } from 'react';
import type { Transaction } from '@/types';
import { useHashRoute } from '@/hooks/useHashRoute';
import { useSettings } from '@/hooks/useSettings';
import { getNotificationPermission, showNotification } from '@/services/notifications/notificationService';
import { formatCurrency } from '@/utils/format';
import { UpdatePrompt } from '@/components/common/UpdatePrompt';
import { useToast } from '@/components/common/ToastProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { Transactions } from '@/pages/Transactions';

interface FormState {
  open: boolean;
  transaction?: Transaction;
}

export default function App() {
  const [route, navigate] = useHashRoute();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>({ open: false });

  const openCreate = useCallback(() => setForm({ open: true }), []);
  const openEdit = useCallback((transaction: Transaction) => setForm({ open: true, transaction }), []);
  const closeForm = useCallback(() => setForm({ open: false }), []);

  const handleSaved = useCallback(
    (transaction: Transaction, mode: 'created' | 'updated') => {
      closeForm();
      showToast(mode === 'created' ? 'Movimiento agregado.' : 'Movimiento actualizado.', 'success');

      // Notificación local opcional (solo con permiso concedido y preferencia activa)
      if (mode === 'created' && settings.notificationsEnabled && getNotificationPermission() === 'granted') {
        const sign = transaction.type === 'income' ? 'Ingreso' : 'Egreso';
        void showNotification(
          'Movimiento registrado',
          `${sign}: ${transaction.description} · ${formatCurrency(transaction.amount, settings.baseCurrency)}`,
        ).catch(() => undefined);
      }
    },
    [closeForm, settings.baseCurrency, settings.notificationsEnabled, showToast],
  );

  return (
    <AppLayout route={route} onNavigate={navigate}>
      {route === '/' && <Dashboard onAdd={openCreate} onEdit={openEdit} />}
      {route === '/transactions' && <Transactions onAdd={openCreate} onEdit={openEdit} />}
      {route === '/settings' && <Settings />}

      <TransactionFormModal
        open={form.open}
        transaction={form.transaction}
        currency={settings.baseCurrency}
        onSaved={handleSaved}
        onClose={closeForm}
      />
      <UpdatePrompt />
    </AppLayout>
  );
}
