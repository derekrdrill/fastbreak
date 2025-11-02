import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export type DbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Helper to find or create venues and return their IDs
export async function resolveVenueIds(
  venueNames: string[],
): Promise<DbResult<{ venueIds: number[]; venueNames: string[] }>> {
  try {
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

        const isNewVenue = newVenue && !venueError;
        if (!isNewVenue) {
          return { success: false, error: venueError?.message || 'Failed to create venue' };
        }

        venueIds.push(Number(newVenue.id));
        venueNamesStored.push(newVenue.name);
      }
    }

    return { success: true, data: { venueIds, venueNames: venueNamesStored } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resolve venues',
    };
  }
}

// Helper to get venue map (id -> name)
export async function getVenueMap(): Promise<Map<number, string>> {
  const supabase = await getSupabaseClient();
  const { data: allVenues } = await supabase.from('venues').select('id, name');

  const venueMap = new Map<number, string>();
  allVenues?.forEach(venue => {
    venueMap.set(Number(venue.id), venue.name);
  });

  return venueMap;
}
