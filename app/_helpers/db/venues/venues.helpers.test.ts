import { resolveVenueIds, getVenueMap } from './venues.helpers';
import { getSupabaseClient } from '../client/client';

jest.mock('../client/client');

const mockGetSupabaseClient = getSupabaseClient as jest.MockedFunction<typeof getSupabaseClient>;

function createMockSupabaseClient() {
  const from = jest.fn().mockReturnThis();
  const select = jest.fn().mockReturnThis();
  return {
    from,
    select,
    ilike: jest.fn().mockReturnThis(),
    limit: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };
}

function setupMockSupabase(mockSupabase: ReturnType<typeof createMockSupabaseClient>) {
  mockGetSupabaseClient.mockResolvedValue(mockSupabase as never);
}

describe('venues', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveVenueIds', () => {
    it('should resolve existing venue names to IDs', async () => {
      const mockSupabase = createMockSupabaseClient();
      mockSupabase.limit.mockResolvedValue({
        data: [{ id: 1, name: 'Stadium A' }],
        error: null,
      });

      setupMockSupabase(mockSupabase);

      const result = await resolveVenueIds({ venueNames: ['Stadium A'] });

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.venueIds).toEqual([1]);
        expect(result.data.venueNames).toEqual(['Stadium A']);
      }
    });

    it('should create new venues when they do not exist', async () => {
      const mockSupabase = createMockSupabaseClient();
      mockSupabase.limit.mockResolvedValue({
        data: [],
        error: null,
      });
      mockSupabase.single.mockResolvedValue({
        data: { id: 2, name: 'New Stadium' },
        error: null,
      });

      setupMockSupabase(mockSupabase);

      const result = await resolveVenueIds({ venueNames: ['New Stadium'] });

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.venueIds).toEqual([2]);
        expect(result.data.venueNames).toEqual(['New Stadium']);
      }
      expect(mockSupabase.insert).toHaveBeenCalledWith({ name: 'New Stadium' });
    });

    it('should return error when venue creation fails', async () => {
      const mockSupabase = createMockSupabaseClient();
      mockSupabase.limit.mockResolvedValue({
        data: [],
        error: null,
      });
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Creation failed' },
      });

      setupMockSupabase(mockSupabase);

      const result = await resolveVenueIds({ venueNames: ['Failed Venue'] });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Creation failed');
    });
  });

  describe('getVenueMap', () => {
    it('should return map of venue IDs to names', async () => {
      const mockVenues = [
        { id: 1, name: 'Stadium A' },
        { id: 2, name: 'Stadium B' },
      ];

      const mockSupabase = createMockSupabaseClient();
      mockSupabase.select.mockResolvedValue({
        data: mockVenues,
        error: null,
      });

      setupMockSupabase(mockSupabase);

      const result = await getVenueMap();

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data).toBeInstanceOf(Map);
        expect(result.data.get(1)).toBe('Stadium A');
        expect(result.data.get(2)).toBe('Stadium B');
      }
    });

    it('should return error when fetch fails', async () => {
      const mockSupabase = createMockSupabaseClient();
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: 'Fetch failed' },
      });

      setupMockSupabase(mockSupabase);

      const result = await getVenueMap();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Fetch failed');
    });
  });
});
