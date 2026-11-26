import { useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { handleError, type AppError } from '@/utils/errors';

interface LiveQueryState<T> {
  data: T | undefined;
  error: AppError | undefined;
  loading: boolean;
}

/**
 * Suscribe un componente a una consulta de Dexie: se vuelve a ejecutar
 * automáticamente cada vez que cambian las tablas que la consulta lee.
 */
export function useLiveQuery<T>(querier: () => Promise<T>, deps: readonly unknown[]): LiveQueryState<T> {
  const [state, setState] = useState<LiveQueryState<T>>({
    data: undefined,
    error: undefined,
    loading: true,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    const subscription = liveQuery(querier).subscribe({
      next: (data) => setState({ data, error: undefined, loading: false }),
      error: (err: unknown) =>
        setState((prev) => ({
          data: prev.data,
          error: handleError(err, 'useLiveQuery', 'No se pudieron cargar los datos.', 'DATABASE'),
          loading: false,
        })),
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
