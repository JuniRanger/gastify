import { useCallback } from 'react';
import type { AppSettings } from '@/types';
import { DEFAULT_SETTINGS, getSettings, updateSettings } from '@/services/database/settingsService';
import { useLiveQuery } from './useLiveQuery';

export function useSettings() {
  const { data, loading, error } = useLiveQuery(() => getSettings(), []);

  const update = useCallback((patch: Partial<AppSettings>) => updateSettings(patch), []);

  return { settings: data ?? DEFAULT_SETTINGS, loading, error, update };
}
