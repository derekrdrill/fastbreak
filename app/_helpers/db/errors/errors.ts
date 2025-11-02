import type { DbResult } from '@/app/_types';

/**
 * Creates a standardized error result for database operations.
 *
 * @param params - Parameters object
 * @param params.message - Error message to return
 * @returns Error result object with success: false
 */
function createError({ message }: { message: string }): DbResult<never> {
  return { success: false, error: message };
}

/**
 * Creates a standardized success result for database operations.
 *
 * @param params - Parameters object
 * @param params.data - Data to return in the success result
 * @returns Success result object with success: true and data
 */
function createSuccess<T>({ data }: { data: T }): DbResult<T> {
  return { success: true, data };
}

/**
 * Extracts a readable error message from various error types.
 *
 * @param params - Parameters object
 * @param params.error - Error object (can be Error instance, string, or other)
 * @param params.fallback - Fallback message if error cannot be extracted
 * @returns Extracted or fallback error message
 */
function getErrorMessage({ error, fallback }: { error: unknown; fallback: string }): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

/**
 * Wraps a database operation with error handling to ensure consistent error responses.
 * Catches any thrown errors and converts them to DbResult format.
 *
 * @param params - Parameters object
 * @param params.operation - Async function that performs the database operation
 * @param params.fallbackError - Default error message if operation throws an unexpected error
 * @returns Result of the operation, wrapped in error handling
 */
async function handleDbOperation<T>({
  operation,
  fallbackError,
}: {
  operation: () => Promise<DbResult<T>>;
  fallbackError: string;
}): Promise<DbResult<T>> {
  try {
    return await operation();
  } catch (error) {
    return { success: false, error: getErrorMessage({ error, fallback: fallbackError }) };
  }
}

/**
 * Handles Supabase query errors and null data, converting them to standardized DbResult format.
 *
 * @param params - Parameters object
 * @param params.data - Data returned from Supabase query (may be null)
 * @param params.error - Error object from Supabase (may be null)
 * @param params.fallbackError - Error message to use if data is null but no error provided
 * @returns Standardized result object
 */
function handleSupabaseError<T>({
  data,
  error,
  fallbackError,
}: {
  data: T | null;
  error: { message: string } | null;
  fallbackError: string;
}): DbResult<T> {
  if (error) {
    return { success: false, error: error.message };
  }
  if (!data) {
    return { success: false, error: fallbackError };
  }
  return { success: true, data };
}

/**
 * Creates a standardized "not found" error result.
 *
 * @param params - Parameters object
 * @param params.message - Error message for the not found error (default: 'Resource not found')
 * @returns Error result object indicating resource was not found
 */
function notFound({ message = 'Resource not found' }: { message?: string } = {}): DbResult<never> {
  return { success: false, error: message };
}

/**
 * Creates a standardized validation error result.
 *
 * @param params - Parameters object
 * @param params.message - Validation error message
 * @returns Error result object indicating validation failure
 */
function validationError({ message }: { message: string }): DbResult<never> {
  return { success: false, error: message };
}

/**
 * Formats a standardized error message string for database operations.
 *
 * @param params - Parameters object
 * @param params.operation - The operation that failed (e.g., "create", "update", "delete")
 * @param params.resource - Optional resource name (e.g., "event", "venue")
 * @param params.context - Optional additional context information
 * @returns Formatted error message
 */
function formatErrorMessage({
  operation,
  resource,
  context,
}: {
  operation: string;
  resource?: string;
  context?: string;
}): string {
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
