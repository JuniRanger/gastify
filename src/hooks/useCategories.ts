import { useMemo } from 'react';
import type { Category } from '@/types';
import { getCategories } from '@/services/database/categoryService';
import { useLiveQuery } from './useLiveQuery';

export function useCategories() {
  const { data, loading, error } = useLiveQuery(() => getCategories(), []);

  const categories = useMemo<Category[]>(() => data ?? [], [data]);
  const byId = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  return { categories, byId, loading, error };
}
