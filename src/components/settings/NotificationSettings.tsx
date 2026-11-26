import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import {
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  type PermissionState,
} from '@/services/notifications/notificationService';
import { toAppError } from '@/utils/errors';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useToast } from '@/components/common/ToastProvider';

const PERMISSION_LABEL: Record<PermissionState, string> = {
  granted: 'Permiso concedido',
  denied: 'Permiso bloqueado en el navegador',
  default: 'Permiso pendiente',
  unsupported: 'No compatible con este navegador',
};

export function NotificationSettings() {
  const { settings, update } = useSettings();
  const { showToast } = useToast();
  const [permission, setPermission] = useState<PermissionState>(getNotificationPermission);

  const supported = permission !== 'unsupported';
  const enabled = settings.notificationsEnabled && permission === 'granted';

  const handleToggle = async () => {
    try {
      if (enabled) {
        await update({ notificationsEnabled: false });
        return;
      }
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result === 'granted') {
        await update({ notificationsEnabled: true });
        showToast('Notificaciones activadas.', 'success');
      } else {
        await update({ notificationsEnabled: false });
        showToast(
          result === 'denied'
            ? 'El permiso está bloqueado. Habilítalo desde los ajustes del navegador.'
            : 'No se concedió el permiso de notificaciones.',
          'error',
        );
      }
    } catch (error) {
      showToast(toAppError(error).message, 'error');
    }
  };

  const handleTest = async () => {
    try {
      await showNotification('Gastify', 'Esta es una notificación de prueba.');
    } catch (error) {
      showToast(toAppError(error).message, 'error');
    }
  };

  return (
    <Card title="Notificaciones">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Bell className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">Avisar al registrar un movimiento</p>
          <p className="text-xs text-slate-500">{PERMISSION_LABEL[permission]}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Activar notificaciones"
          disabled={!supported}
          onClick={handleToggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            enabled ? 'bg-brand-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      {enabled && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={handleTest}>
          Enviar notificación de prueba
        </Button>
      )}
    </Card>
  );
}
