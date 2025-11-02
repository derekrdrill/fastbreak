import {
  createError,
  createSuccess,
  getErrorMessage,
  handleDbOperation,
  handleSupabaseError,
  notFound,
  validationError,
  formatErrorMessage,
} from './errors.helpers';

describe('errors', () => {
  describe('createError', () => {
    it('should return error result with message', () => {
      const result = createError({ message: 'Test error' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
    });
  });

  describe('createSuccess', () => {
    it('should return success result with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = createSuccess({ data });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });
  });

  describe('getErrorMessage', () => {
    it('should return error message from Error instance', () => {
      const error = new Error('Error message');
      const result = getErrorMessage({ error, fallback: 'Fallback' });
      expect(result).toBe('Error message');
    });

    it('should return string when error is a string', () => {
      const error = 'String error';
      const result = getErrorMessage({ error, fallback: 'Fallback' });
      expect(result).toBe('String error');
    });

    it('should return fallback for unknown error types', () => {
      const error = { some: 'object' };
      const result = getErrorMessage({ error, fallback: 'Fallback message' });
      expect(result).toBe('Fallback message');
    });
  });

  describe('handleDbOperation', () => {
    it('should return success result when operation succeeds', async () => {
      const operation = async () => createSuccess({ data: 'test data' });
      const result = await handleDbOperation({ operation, fallbackError: 'Error' });
      expect(result.success).toBe(true);
      expect(result.data).toBe('test data');
    });

    it('should return error result when operation throws', async () => {
      const operation = async () => {
        throw new Error('Operation failed');
      };
      const result = await handleDbOperation({ operation, fallbackError: 'Fallback error' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Operation failed');
    });

    it('should use fallback error for non-Error exceptions', async () => {
      const operation = async () => {
        throw 'String exception';
      };
      const result = await handleDbOperation({ operation, fallbackError: 'Fallback error' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('String exception');
    });
  });

  describe('handleSupabaseError', () => {
    it('should return error result when Supabase error exists', () => {
      const error = { message: 'Supabase error' };
      const result = handleSupabaseError({ data: null, error, fallbackError: 'Fallback' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Supabase error');
    });

    it('should return error result when data is null and no error', () => {
      const result = handleSupabaseError({ data: null, error: null, fallbackError: 'Fallback' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Fallback');
    });

    it('should return success result when data exists', () => {
      const data = { id: 1 };
      const result = handleSupabaseError({ data, error: null, fallbackError: 'Fallback' });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });
  });

  describe('notFound', () => {
    it('should return error result with default message', () => {
      const result = notFound();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Resource not found');
    });

    it('should return error result with custom message', () => {
      const result = notFound({ message: 'Custom not found' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Custom not found');
    });
  });

  describe('validationError', () => {
    it('should return error result with validation message', () => {
      const result = validationError({ message: 'Validation failed' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error message with operation only', () => {
      const result = formatErrorMessage({ operation: 'create' });
      expect(result).toBe('Unable to create');
    });

    it('should format error message with operation and resource', () => {
      const result = formatErrorMessage({ operation: 'update', resource: 'event' });
      expect(result).toBe('Unable to update event');
    });

    it('should format error message with operation, resource, and context', () => {
      const result = formatErrorMessage({
        operation: 'delete',
        resource: 'event',
        context: 'permission denied',
      });
      expect(result).toBe('Unable to delete event: permission denied');
    });
  });
});
