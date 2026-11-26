export type ErrorCode =
  | 'VALIDATION'
  | 'DATABASE'
  | 'NETWORK'
  | 'API'
  | 'PERMISSION'
  | 'UNSUPPORTED'
  | 'NOT_FOUND'
  | 'UNKNOWN';

/** Error de aplicación con código y mensaje apto para mostrarse al usuario. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly originalError?: unknown;

  constructor(message: string, code: ErrorCode = 'UNKNOWN', originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
  }
}

export function toAppError(
  error: unknown,
  fallbackMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  fallbackCode: ErrorCode = 'UNKNOWN',
): AppError {
  if (error instanceof AppError) return error;
  return new AppError(fallbackMessage, fallbackCode, error);
}

/**
 * Punto único para registrar y normalizar errores.
 * Devuelve un AppError listo para lanzarse o mostrarse en la UI.
 */
export function handleError(
  error: unknown,
  context: string,
  fallbackMessage?: string,
  fallbackCode?: ErrorCode,
): AppError {
  const appError = toAppError(error, fallbackMessage, fallbackCode);
  console.error(`[Gastify:${context}]`, error);
  return appError;
}

/** Captura errores no controlados a nivel global (llamar una vez en main.tsx). */
export function registerGlobalErrorHandlers(): void {
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'unhandledrejection');
  });
  window.addEventListener('error', (event) => {
    handleError(event.error ?? event.message, 'window.onerror');
  });
}
