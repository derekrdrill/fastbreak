import type { DbResult } from '@/app/_types';

function createError(message: string): DbResult<never> {
  return { success: false, error: message };
}

function createSuccess<T>(data: T): DbResult<T> {
  return { success: true, data };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

async function handleDbOperation<T>(
  operation: () => Promise<DbResult<T>>,
  fallbackError: string,
): Promise<DbResult<T>> {
  try {
    return await operation();
  } catch (error) {
    return { success: false, error: getErrorMessage(error, fallbackError) };
  }
}

function handleSupabaseError<T>(
  data: T | null,
  error: { message: string } | null,
  fallbackError: string,
): DbResult<T> {
  if (error) {
    return { success: false, error: error.message };
  }
  if (!data) {
    return { success: false, error: fallbackError };
  }
  return { success: true, data };
}

function notFound(message = 'Resource not found'): DbResult<never> {
  return { success: false, error: message };
}

function validationError(message: string): DbResult<never> {
  return { success: false, error: message };
}

function formatErrorMessage(operation: string, resource?: string, context?: string): string {
  const resourceText = resource ? ` ${resource}` : '';
  const contextText = context ? `: ${context}` : '';
  return `Unable to ${operation}${resourceText}${contextText}`;
}

export {
  createError,
  createSuccess,
  getErrorMessage,
  handleDbOperation,
  handleSupabaseError,
  notFound,
  validationError,
  formatErrorMessage,
};
