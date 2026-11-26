import { AppError } from '@/utils/errors';

/**
 * API REST externa: Open Exchange Rate API (open.er-api.com).
 * Endpoint público sin API key: GET /v6/latest/{BASE}
 * Consulta sus términos de uso (incluyen atribución) antes de desplegar.
 */
const API_BASE_URL = 'https://open.er-api.com/v6/latest';

export interface ExchangeRateResult {
  base: string;
  target: string;
  /** 1 unidad de `base` equivale a `rate` unidades de `target` */
  rate: number;
  /** Fecha de última actualización informada por la API (si la incluye) */
  updatedAt: string | null;
}

interface ExchangeRateApiResponse {
  result?: string;
  base_code?: string;
  time_last_update_utc?: string;
  rates?: Record<string, unknown>;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * Consulta el tipo de cambio entre dos monedas.
 * Lanza AppError('NETWORK' | 'API') con mensajes aptos para la interfaz.
 * Las cancelaciones (AbortSignal) se propagan como AbortError.
 */
export async function fetchExchangeRate(
  base: string,
  target: string,
  signal?: AbortSignal,
): Promise<ExchangeRateResult> {
  if (base === target) {
    return { base, target, rate: 1, updatedAt: null };
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/${encodeURIComponent(base)}`, { signal });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new AppError(
      'No se pudo conectar con el servicio de tipos de cambio. Revisa tu conexión.',
      'NETWORK',
      error,
    );
  }

  if (!response.ok) {
    throw new AppError(
      `El servicio de tipos de cambio respondió con un error (${response.status}).`,
      'API',
    );
  }

  let payload: ExchangeRateApiResponse;
  try {
    payload = (await response.json()) as ExchangeRateApiResponse;
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new AppError('La respuesta del servicio de tipos de cambio no es válida.', 'API', error);
  }

  const rate = payload.rates?.[target];
  if (payload.result !== 'success' || typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new AppError(`No hay tipo de cambio disponible para ${base} → ${target}.`, 'API');
  }

  return {
    base,
    target,
    rate,
    updatedAt: payload.time_last_update_utc ?? null,
  };
}
