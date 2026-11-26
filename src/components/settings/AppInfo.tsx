import { Download } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { APP_NAME, APP_VERSION } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export function AppInfo() {
  const { canInstall, installed, install } = useInstallPrompt();
  const online = useOnlineStatus();

  return (
    <Card title="Información de la aplicación">
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Aplicación</dt>
          <dd className="font-medium text-slate-900">{APP_NAME}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Versión</dt>
          <dd className="font-medium text-slate-900">{APP_VERSION}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Almacenamiento</dt>
          <dd className="font-medium text-slate-900">IndexedDB (local)</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Conexión</dt>
          <dd className="font-medium text-slate-900">{online ? 'En línea' : 'Sin conexión'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Instalación</dt>
          <dd className="font-medium text-slate-900">{installed ? 'Instalada' : 'No instalada'}</dd>
        </div>
      </dl>

      {canInstall && (
        <Button className="mt-4" icon={<Download className="h-4 w-4" aria-hidden />} onClick={() => void install()}>
          Instalar aplicación
        </Button>
      )}
      {!installed && !canInstall && (
        <p className="mt-4 text-xs text-slate-500">
          Para instalar: usa el menú del navegador (&quot;Instalar aplicación&quot;) o, en iOS,
          Compartir → Añadir a pantalla de inicio.
        </p>
      )}
    </Card>
  );
}
