import { AppError, handleError } from '@/utils/errors';

/**
 * Ejecuta una operación de IndexedDB y normaliza cualquier fallo a AppError('DATABASE').
 * Los AppError ya construidos (validación, no encontrado) se propagan sin cambios.
 */
export async function runDb<T>(
  context: string,
  userMessage: string,
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw handleError(error, context, userMessage, 'DATABASE');
  }
}
