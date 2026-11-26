import { Search } from 'lucide-react';
import type { Category, TransactionFilters as Filters } from '@/types';
import { inputClass } from '@/components/common/Field';

interface TransactionFiltersProps {
  filters: Filters;
  categories: readonly Category[];
  onChange: (filters: Filters) => void;
}

export function TransactionFilters({ filters, categories, onChange }: TransactionFiltersProps) {
  const visibleCategories =
    filters.type === 'all' ? categories : categories.filter((c) => c.type === filters.type);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Buscar por descripción o notas"
          aria-label="Buscar movimientos"
          className={`${inputClass} pl-9`}
        />
      </div>

      <select
        value={filters.type}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value as Filters['type'], category: 'all' })
        }
        aria-label="Filtrar por tipo"
        className={inputClass}
      >
        <option value="all">Todos los tipos</option>
        <option value="income">Ingresos</option>
        <option value="expense">Egresos</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        aria-label="Filtrar por categoría"
        className={inputClass}
      >
        <option value="all">Todas las categorías</option>
        {visibleCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
