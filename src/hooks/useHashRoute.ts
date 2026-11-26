import { useCallback, useEffect, useState } from 'react';

export type Route = '/' | '/transactions' | '/settings';

const ROUTES: readonly Route[] = ['/', '/transactions', '/settings'];

function readRoute(): Route {
  const path = window.location.hash.replace(/^#/, '') || '/';
  return (ROUTES as readonly string[]).includes(path) ? (path as Route) : '/';
}

/**
 * Enrutado mínimo basado en hash (#/transactions).
 * Evita una dependencia extra y no requiere configurar rewrites en el servidor.
 */
export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = next;
  }, []);

  return [route, navigate];
}
