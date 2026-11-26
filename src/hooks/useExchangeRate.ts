import { useCallback, useEffect, useState } from 'react';
import { fetchExchangeRate, type ExchangeRateResult } from '@/services/currency/exchangeRateService';
import { handleError, type AppError } from '@/utils/errors';

type Status = 'loading' | 'success' | 'error';

interface State {
  status: Status;
  data?: ExchangeRateResult;
  error?: AppError;
}

/** Estado de carga/éxito/error para la consulta del tipo de cambio. */
export function useExchangeRate(base: string, target: string) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchExchangeRate(base, target, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          error: handleError(error, 'useExchangeRate', 'No se pudo obtener el tipo de cambio.', 'API'),
        });
      });

    return () => controller.abort();
  }, [base, target, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  return { ...state, refresh };
}
