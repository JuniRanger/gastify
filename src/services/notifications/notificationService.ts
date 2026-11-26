import { AppError } from '@/utils/errors';

export type PermissionState = NotificationPermission | 'unsupported';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): PermissionState {
  return isNotificationSupported() ? Notification.permission : 'unsupported';
}

/**
 * Solicita permiso de notificaciones. Debe llamarse desde un gesto del usuario
 * (por ejemplo, al pulsar un botón).
 */
export async function requestNotificationPermission(): Promise<PermissionState> {
  if (!isNotificationSupported()) {
    throw new AppError('Este navegador no admite notificaciones.', 'UNSUPPORTED');
  }
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

/**
 * Muestra una notificación local. Prefiere el service worker (necesario en Android)
 * y recurre a `new Notification` cuando no hay registro activo.
 */
export async function showNotification(title: string, body: string): Promise<void> {
  if (!isNotificationSupported()) {
    throw new AppError('Este navegador no admite notificaciones.', 'UNSUPPORTED');
  }
  if (Notification.permission !== 'granted') {
    throw new AppError(
      'Las notificaciones están bloqueadas o aún no concediste el permiso.',
      'PERMISSION',
    );
  }

  const options: NotificationOptions = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
  }
  new Notification(title, options);
}
