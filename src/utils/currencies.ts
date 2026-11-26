export interface CurrencyOption {
  code: string;
  name: string;
}

/** Lista estática de monedas ofrecidas en la interfaz (códigos ISO 4217). */
export const CURRENCIES: readonly CurrencyOption[] = [
  { code: 'MXN', name: 'Peso mexicano' },
  { code: 'USD', name: 'Dólar estadounidense' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra esterlina' },
  { code: 'CAD', name: 'Dólar canadiense' },
  { code: 'JPY', name: 'Yen japonés' },
  { code: 'COP', name: 'Peso colombiano' },
  { code: 'ARS', name: 'Peso argentino' },
  { code: 'CLP', name: 'Peso chileno' },
  { code: 'BRL', name: 'Real brasileño' },
];
