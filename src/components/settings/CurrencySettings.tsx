import { RefreshCw } from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useLiveQuery } from '@/hooks/useLiveQuery';
import { useSettings } from '@/hooks/useSettings';
import { getSummary } from '@/services/database/statsService';
import { toAppError } from '@/utils/errors';
import { CURRENCIES } from '@/utils/currencies';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Field, inputClass } from '@/components/common/Field';
import { Spinner } from '@/components/common/Spinner';
import { useToast } from '@/components/common/ToastProvider';

export function CurrencySettings() {
  const { settings, update } = useSettings();
  const { showToast } = useToast();
  const { baseCurrency, targetCurrency } = settings;
  const rateQuery = useExchangeRate(baseCurrency, targetCurrency);
  const { data: summary } = useLiveQuery(() => getSummary(), []);

  const save = async (patch: Partial<typeof settings>) => {
    try {
      await update(patch);
    } catch (error) {
      showToast(toAppError(error).message, 'error');
    }
  };

  const rate =
    rateQuery.data && rateQuery.data.base === baseCurrency && rateQuery.data.target === targetCurrency
      ? rateQuery.data
      : undefined;

  return (
    <>
      <Card title="Moneda">
        <Field
          label="Moneda de tus movimientos"
          htmlFor="base-currency"
          hint="Se usa para mostrar todos tus importes. No convierte los datos ya guardados."
        >
          <select
            id="base-currency"
            value={baseCurrency}
            onChange={(e) => void save({ baseCurrency: e.target.value })}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} · {c.name}
              </option>
            ))}
          </select>
        </Field>
      </Card>

      <Card
        title="Tipo de cambio"
        action={
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" aria-hidden />}
            onClick={rateQuery.refresh}
            disabled={rateQuery.status === 'loading'}
          >
            Actualizar
          </Button>
        }
      >
        <Field label="Convertir a" htmlFor="target-currency">
          <select
            id="target-currency"
            value={targetCurrency}
            onChange={(e) => void save({ targetCurrency: e.target.value })}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} · {c.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="mt-4">
          {rateQuery.status === 'loading' && <Spinner label="Consultando tipo de cambio…" />}

          {rateQuery.status === 'error' && rateQuery.error && (
            <ErrorMessage message={rateQuery.error.message} onRetry={rateQuery.refresh} />
          )}

          {rateQuery.status === 'success' && rate && (
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">
                1 {rate.base} = {rate.rate.toLocaleString('es-MX', { maximumFractionDigits: 6 })}{' '}
                {rate.target}
              </p>
              {summary && (
                <p className="text-slate-700">
                  Tu balance ({formatCurrency(summary.balance, rate.base)}) equivale a{' '}
                  <strong>{formatCurrency(summary.balance * rate.rate, rate.target)}</strong>.
                </p>
              )}
              {rate.updatedAt && (
                <p className="text-xs text-slate-500">
                  Actualizado por el proveedor: {formatDateTime(rate.updatedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
