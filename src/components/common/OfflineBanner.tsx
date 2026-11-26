import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-xs font-medium text-amber-900"
    >
      <WifiOff className="h-4 w-4" aria-hidden />
      Sin conexión: tus movimientos guardados siguen disponibles.
    </div>
  );
}
