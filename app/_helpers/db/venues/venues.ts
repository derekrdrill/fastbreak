import { getSupabaseClient } from '../client/client';
import { handleDbOperation, createError, createSuccess } from '../errors/errors';
import type { DbResult } from '@/app/_types';

async function resolveVenueIds(
  venueNames: string[],
): Promise<DbResult<{ venueIds: number[]; venueNames: string[] }>> {
  return handleDbOperation(async () => {
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
          return createError(venueError?.message || 'Failed to create venue');
        }

        venueIds.push(Number(newVenue.id));
        venueNamesStored.push(newVenue.name);
      }
    }

    return createSuccess({ venueIds, venueNames: venueNamesStored });
  }, 'Failed to resolve venues');
}

async function getVenueMap(): Promise<DbResult<Map<number, string>>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();
    const { data: allVenues, error } = await supabase.from('venues').select('id, name');

    if (error) {
      return createError(error.message);
    }

    const venueMap = new Map<number, string>();
    allVenues?.forEach(venue => {
      venueMap.set(Number(venue.id), venue.name);
    });

    return createSuccess(venueMap);
  }, 'Failed to fetch venues');
}

export { resolveVenueIds, getVenueMap };
