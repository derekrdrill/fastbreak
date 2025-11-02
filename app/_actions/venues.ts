'use server';

import {
  getSupabaseClient,
  handleDbOperation,
  handleSupabaseError,
  createSuccess,
  type DbResult,
} from '@/app/_helpers/db';
import type { Venue } from '@/app/_types';

export async function getVenues(): Promise<DbResult<Venue[]>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.from('venues').select('*').order('name');

    const result = handleSupabaseError(data, error, 'Failed to fetch venues');
    if (!result.success) {
      return result;
    }

    return createSuccess(data || []);
  }, 'Failed to fetch venues');
}
