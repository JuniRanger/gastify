export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  /** Importe siempre positivo; el signo lo determina `type`. */
  amount: number;
  type: TransactionType;
  /** id de Category */
  category: string;
  /** Fecha local en formato YYYY-MM-DD */
  date: string;
  notes?: string;
  /** Epoch ms */
  createdAt: number;
  /** Epoch ms */
  updatedAt: number;
}

/** Datos que aporta el usuario al crear/editar un movimiento. */
export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  /** Color hexadecimal, usado en listas y gráficas */
  color: string;
  /** Clave del mapa de iconos (utils/icons.ts) */
  icon: string;
}

export interface AppSettings {
  /** Moneda en la que se registran y muestran los movimientos (ISO 4217) */
  baseCurrency: string;
  /** Moneda objetivo para consultar el tipo de cambio */
  targetCurrency: string;
  notificationsEnabled: boolean;
}

/** Registro genérico de la tabla `settings` en IndexedDB. */
export interface SettingRecord {
  key: string;
  value: unknown;
}

export interface Summary {
  income: number;
  expense: number;
  balance: number;
  count: number;
}

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

export interface TransactionFilters {
  type: TransactionType | 'all';
  category: string | 'all';
  search: string;
}
