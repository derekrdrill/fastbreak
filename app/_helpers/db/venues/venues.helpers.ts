import { getSupabaseClient } from '../client/client';
import { handleDbOperation, createError, createSuccess } from '../errors/errors.helpers';
import type { DbResult } from '@/app/_types';

/**
 * Resolves venue names to venue IDs, creating new venues if they don't exist.
 * For each venue name, checks if it exists (case-insensitive) and uses the existing ID,
 * or creates a new venue record if it doesn't exist.
 *
 * @param params - Parameters object
 * @param params.venueNames - Array of venue names to resolve
 * @returns Result containing arrays of venue IDs and stored venue names
 */
async function resolveVenueIds({
  venueNames,
}: {
  venueNames: string[];
}): Promise<DbResult<{ venueIds: number[]; venueNames: string[] }>> {
  return handleDbOperation({
    operation: async () => {
    const supabase = await getSupabaseClient();
    const venueIds: number[] = [];
    const venueNamesStored: string[] = [];

    for (const venueName of venueNames) {
      const { data: existingVenues, error: findError } = await supabase
        .from('venues')
        .select('id, name')
        .ilike('name', venueName)
        .limit(1);

      const isExistingVenue = existingVenues?.length && !findError;

      if (isExistingVenue) {
        const existingVenue = existingVenues[0];
        venueIds.push(Number(existingVenue.id));
        venueNamesStored.push(existingVenue.name);
      } else {
        const { data: newVenue, error: venueError } = await supabase
          .from('venues')
          .insert({ name: venueName })
          .select('id, name')
          .single();

        if (venueError || !newVenue) {
          return createError({ message: venueError?.message || 'Failed to create venue' });
        }

        venueIds.push(Number(newVenue.id));
        venueNamesStored.push(newVenue.name);
      }
    }

    return createSuccess({ data: { venueIds, venueNames: venueNamesStored } });
    },
    fallbackError: 'Failed to resolve venues',
  });
}

/**
 * Fetches all venues from the database and returns them as a Map.
 * The map uses venue IDs as keys and venue names as values for efficient lookups.
 *
 * @returns Result containing a Map of venue ID to venue name
 */
async function getVenueMap(): Promise<DbResult<Map<number, string>>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();
      const { data: allVenues, error } = await supabase.from('venues').select('id, name');

      if (error) {
        return createError({ message: error.message });
      }

      const venueMap = new Map<number, string>();
      allVenues?.forEach(venue => {
        venueMap.set(Number(venue.id), venue.name);
      });

      return createSuccess({ data: venueMap });
    },
    fallbackError: 'Failed to fetch venues',
  });
}

export { resolveVenueIds, getVenueMap };
