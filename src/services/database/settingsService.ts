import type { AppSettings } from '@/types';
import { db } from './db';
import { runDb } from './runDb';

const SETTINGS_KEY = 'app';

export const DEFAULT_SETTINGS: AppSettings = {
  baseCurrency: 'MXN',
  targetCurrency: 'USD',
  notificationsEnabled: false,
};

export function getSettings(): Promise<AppSettings> {
  return runDb('getSettings', 'No se pudo cargar la configuración.', async () => {
    const record = await db.settings.get(SETTINGS_KEY);
    const stored = (record?.value ?? {}) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...stored };
  });
}

export function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  return runDb('updateSettings', 'No se pudo guardar la configuración.', async () => {
    const current = await getSettings();
    const next: AppSettings = { ...current, ...patch };
    await db.settings.put({ key: SETTINGS_KEY, value: next });
    return next;
  });
}
