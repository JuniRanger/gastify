import Dexie, { type Table } from 'dexie';
import type { Category, SettingRecord, Transaction } from '@/types';
import { DEFAULT_CATEGORIES } from './defaultCategories';

class GastifyDB extends Dexie {
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  settings!: Table<SettingRecord, string>;

  constructor() {
    super('gastify');

    // Solo se declaran los campos indexados; el resto se guarda igualmente.
    this.version(1).stores({
      transactions: 'id, type, category, date, createdAt',
      categories: 'id, type',
      settings: 'key',
    });

    // Se ejecuta únicamente cuando la base de datos se crea por primera vez.
    this.on('populate', (tx) => {
      tx.table('categories').bulkAdd(DEFAULT_CATEGORIES);
    });
  }
}

export const db = new GastifyDB();
