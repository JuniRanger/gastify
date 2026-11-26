import { useRegisterSW } from 'virtual:pwa-register/react';
import { handleError } from '@/utils/errors';
import { Button } from './Button';

/** Registra el service worker y avisa cuando hay versión nueva o la app ya funciona offline. */
export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      handleError(error, 'serviceWorker', 'No se pudo registrar el modo sin conexión.');
    },
  });

  if (!offlineReady && !needRefresh) return null;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-slate-900 p-3 text-sm text-white shadow-xl md:bottom-4"
    >
      <span>
        {needRefresh ? 'Hay una nueva versión disponible.' : 'Gastify ya está lista para usarse sin conexión.'}
      </span>
      <div className="flex shrink-0 gap-2">
        {needRefresh && (
          <Button size="sm" onClick={() => void updateServiceWorker(true)}>
            Actualizar
          </Button>
        )}
        <Button size="sm" variant="ghost" className="!text-white hover:!bg-white/10" onClick={close}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}
