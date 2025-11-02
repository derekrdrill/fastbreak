'use server';

import { getSupabaseClient, type DbResult } from '@/app/_lib/db-helpers';
import type { Venue } from '@/app/_lib/types';

export async function getVenues(): Promise<DbResult<Venue[]>> {
  try {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.from('venues').select('*').order('name');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch venues',
    };
  }
}
