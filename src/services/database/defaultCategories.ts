import type { Category } from '@/types';

/** Categorías iniciales que se insertan al crear la base de datos por primera vez. */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'exp-food', name: 'Alimentación', type: 'expense', color: '#f97316', icon: 'utensils' },
  { id: 'exp-transport', name: 'Transporte', type: 'expense', color: '#3b82f6', icon: 'car' },
  { id: 'exp-housing', name: 'Vivienda', type: 'expense', color: '#8b5cf6', icon: 'home' },
  { id: 'exp-health', name: 'Salud', type: 'expense', color: '#ef4444', icon: 'heart' },
  { id: 'exp-fun', name: 'Entretenimiento', type: 'expense', color: '#ec4899', icon: 'gamepad' },
  { id: 'exp-edu', name: 'Educación', type: 'expense', color: '#14b8a6', icon: 'graduation' },
  { id: 'exp-shopping', name: 'Compras', type: 'expense', color: '#eab308', icon: 'shopping' },
  { id: 'exp-other', name: 'Otros gastos', type: 'expense', color: '#64748b', icon: 'more' },
  { id: 'inc-salary', name: 'Salario', type: 'income', color: '#16a34a', icon: 'wallet' },
  { id: 'inc-freelance', name: 'Freelance', type: 'income', color: '#0ea5e9', icon: 'laptop' },
  { id: 'inc-invest', name: 'Inversiones', type: 'income', color: '#22c55e', icon: 'trending' },
  { id: 'inc-other', name: 'Otros ingresos', type: 'income', color: '#84cc16', icon: 'banknote' },
];
