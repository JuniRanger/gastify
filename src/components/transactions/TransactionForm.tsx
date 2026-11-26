import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Transaction, TransactionType } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { createTransaction, updateTransaction } from '@/services/database/transactionService';
import { toAppError } from '@/utils/errors';
import { todayISO } from '@/utils/format';
import { DESCRIPTION_MAX, NOTES_MAX } from '@/utils/constants';
import {
  validateTransactionForm,
  type FormErrors,
  type TransactionFormValues,
} from '@/utils/validation';
import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Field, inputClass } from '@/components/common/Field';

interface TransactionFormProps {
  /** Si se recibe, el formulario edita ese movimiento; si no, crea uno nuevo. */
  transaction?: Transaction;
  currency: string;
  onSaved: (transaction: Transaction, mode: 'created' | 'updated') => void;
  onCancel: () => void;
}

function initialValues(transaction?: Transaction): TransactionFormValues {
  if (!transaction) {
    return { description: '', amount: '', type: 'expense', category: '', date: todayISO(), notes: '' };
  }
  return {
    description: transaction.description,
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    notes: transaction.notes ?? '',
  };
}

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Egreso' },
  { value: 'income', label: 'Ingreso' },
];

export function TransactionForm({ transaction, currency, onSaved, onCancel }: TransactionFormProps) {
  const { categories, loading: loadingCategories, error: categoriesError } = useCategories();
  const [values, setValues] = useState<TransactionFormValues>(() => initialValues(transaction));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categoriesForType = useMemo(
    () => categories.filter((c) => c.type === values.type),
    [categories, values.type],
  );

  // Mantiene una categoría válida para el tipo seleccionado.
  useEffect(() => {
    if (categoriesForType.length === 0) return;
    if (!categoriesForType.some((c) => c.id === values.category)) {
      setValues((prev) => ({ ...prev, category: categoriesForType[0]?.id ?? '' }));
    }
  }, [categoriesForType, values.category]);

  const setField = <K extends keyof TransactionFormValues>(key: K, value: TransactionFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { errors: validationErrors, data } = validateTransactionForm(values, categories);
    setErrors(validationErrors);
    if (!data) return;

    setSaving(true);
    setSubmitError(null);
    try {
      if (transaction) {
        onSaved(await updateTransaction(transaction.id, data), 'updated');
      } else {
        onSaved(await createTransaction(data), 'created');
      }
    } catch (error) {
      setSubmitError(toAppError(error).message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <ErrorMessage message={submitError} />}
      {categoriesError && <ErrorMessage message={categoriesError.message} />}

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-slate-700">Tipo</legend>
        <div role="radiogroup" className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          {TYPE_OPTIONS.map(({ value, label }) => {
            const active = values.type === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setField('type', value)}
                className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                  active
                    ? value === 'income'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label="Descripción" htmlFor="tx-description" error={errors.description}>
        <input
          id="tx-description"
          type="text"
          value={values.description}
          maxLength={DESCRIPTION_MAX}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Ej. Supermercado"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'tx-description-error' : undefined}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Importe (${currency})`} htmlFor="tx-amount" error={errors.amount}>
          <input
            id="tx-amount"
            type="text"
            inputMode="decimal"
            value={values.amount}
            onChange={(e) => setField('amount', e.target.value)}
            placeholder="0.00"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'tx-amount-error' : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Fecha" htmlFor="tx-date" error={errors.date}>
          <input
            id="tx-date"
            type="date"
            value={values.date}
            onChange={(e) => setField('date', e.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'tx-date-error' : undefined}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Categoría" htmlFor="tx-category" error={errors.category}>
        <select
          id="tx-category"
          value={values.category}
          onChange={(e) => setField('category', e.target.value)}
          disabled={loadingCategories}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? 'tx-category-error' : undefined}
          className={inputClass}
        >
          {categoriesForType.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notas (opcional)" htmlFor="tx-notes" error={errors.notes}>
        <textarea
          id="tx-notes"
          rows={3}
          value={values.notes}
          maxLength={NOTES_MAX}
          onChange={(e) => setField('notes', e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {transaction ? 'Guardar cambios' : 'Agregar movimiento'}
        </Button>
      </div>
    </form>
  );
}
