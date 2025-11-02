'use server';

import {
  getSupabaseClient,
  resolveVenueIds,
  getVenueMap,
  handleDbOperation,
  handleSupabaseError,
  createError,
  createSuccess,
  validationError,
  notFound,
  type DbResult,
} from '@/app/_helpers/db';
import type { Event } from '@/app/_types';

/**
 * Creates a new event in the database.
 * Resolves venue names to IDs (creating venues if needed) and associates the event with a sport type.
 *
 * @param params - Parameters object
 * @param params.fullName - Full name of the event (e.g., "Los Angeles Lakers vs. Boston Celtics")
 * @param params.shortName - Short name of the event (e.g., "LAL v BOS")
 * @param params.description - Optional description of the event
 * @param params.sportType - Name of the sport type (must match a sport in SPORTS constant)
 * @param params.date - Date and time of the event (ISO string format)
 * @param params.venueNames - Array of venue names (venues will be created if they don't exist)
 * @returns Result containing the created event with venue names populated
 */
export async function createEvent({
  fullName,
  shortName,
  description,
  sportType,
  date,
  venueNames,
}: {
  fullName: string;
  shortName: string;
  description: string;
  sportType: string;
  date: string;
  venueNames: string[];
}): Promise<DbResult<Event>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const { SPORTS } = await import('@/app/_constants/events');
      const sport = SPORTS.find(s => s.name === sportType);
      if (!sport) {
        return validationError({ message: `Invalid sport type: "${sportType}" is not recognized` });
      }

      const venuesResult = await resolveVenueIds({ venueNames });
      if (!venuesResult.success || !venuesResult.data) {
        return createError({
          message: venuesResult.error || 'Unable to process venue information',
        });
      }
      const { venueIds, venueNames: venueNamesStored } = venuesResult.data;

      const { data: eventData, error } = await supabase
        .from('events')
        .insert({
          fullName,
          shortName,
          description,
          sportTypeId: sport.id,
          date,
          venueIds,
        })
        .select()
        .single();

      const eventResult = handleSupabaseError({
        data: eventData,
        error,
        fallbackError: 'Unable to create event. Please try again or check your input.',
      });
      if (!eventResult.success) {
        return eventResult;
      }

      const event: Event = {
        id: eventData.id,
        fullName: eventData.fullName,
        shortName: eventData.shortName,
        description: eventData.description || '',
        sportTypeId: eventData.sportTypeId,
        date: eventData.date,
        venues: venueNamesStored,
      };

      return createSuccess({ data: event });
    },
    fallbackError: 'Failed to create event',
  });
}

/**
 * Updates an existing event in the database.
 * Resolves venue names to IDs (creating venues if needed) and updates all event fields.
 *
 * @param params - Parameters object (Event type)
 * @param params.id - ID of the event to update
 * @param params.fullName - Updated full name of the event
 * @param params.shortName - Updated short name of the event
 * @param params.description - Updated description of the event
 * @param params.sportTypeId - Updated sport type ID
 * @param params.date - Updated date and time of the event
 * @param params.venues - Updated array of venue names
 * @returns Result containing the updated event
 */
export async function updateEvent({
  id,
  fullName,
  shortName,
  description,
  sportTypeId,
  venues,
  date,
}: Event): Promise<DbResult<Event>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const venuesResult = await resolveVenueIds({ venueNames: venues });
      if (!venuesResult.success || !venuesResult.data) {
        return createError({
          message: venuesResult.error || 'Unable to process venue information',
        });
      }
      const { venueIds } = venuesResult.data;

      const { data: eventData, error } = await supabase
        .from('events')
        .update({
          fullName,
          shortName,
          description,
          sportTypeId,
          date,
          venueIds,
        })
        .eq('id', id)
        .select()
        .single();

      const eventResult = handleSupabaseError({
        data: eventData,
        error,
        fallbackError:
          'Unable to update event. The event may not exist or you may not have permission.',
      });
      if (!eventResult.success) {
        return eventResult;
      }

      const event: Event = {
        id: eventData.id,
        fullName: eventData.fullName,
        shortName: eventData.shortName,
        description: eventData.description || '',
        sportTypeId: eventData.sportTypeId,
        date: eventData.date,
        venues,
      };

      return createSuccess({ data: event });
    },
    fallbackError: 'Failed to update event',
  });
}

/**
 * Deletes an event from the database.
 * Verifies the event exists before deletion and confirms successful deletion.
 *
 * @param params - Parameters object
 * @param params.eventId - ID of the event to delete
 * @returns Result indicating success or failure of the deletion
 */
export async function deleteEvent({ eventId }: { eventId: number }): Promise<DbResult<null>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const { data: existingEvent, error: findError } = await supabase
        .from('events')
        .select('id')
        .eq('id', eventId)
        .maybeSingle();

      if (findError) {
        return createError({ message: 'Unable to verify event exists' });
      }

      if (!existingEvent) {
        return notFound({
          message: 'Event not found. It may have been deleted or does not exist.',
        });
      }

      const { data: deletedData, error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .select();

      if (deleteError) {
        return createError({
          message: deleteError.message || 'Unable to delete event. Please try again.',
        });
      }

      if (!deletedData || deletedData.length === 0) {
        return createError({
          message: 'Event could not be deleted. You may not have permission to delete this event.',
        });
      }

      return createSuccess({ data: null });
    },
    fallbackError: 'Failed to delete event',
  });
}

/**
 * Fetches events from the database with optional filtering.
 * Supports filtering by search query (name/description) and sport type.
 * Returns events with venue IDs converted to venue names.
 *
 * @param params - Parameters object
 * @param params.filters - Optional filters object
 * @param params.filters.search - Optional search query to filter by event name or description
 * @param params.filters.sportTypeId - Optional sport type ID to filter by
 * @returns Result containing array of filtered events with venue names populated
 */
export async function getEvents({
  filters,
}: {
  filters?: {
    search?: string;
    sportTypeId?: number | null;
  };
}): Promise<DbResult<Event[]>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      let query = supabase.from('events').select('*').order('date', { ascending: true });

      if (filters?.search) {
        query = query.or(
          `fullName.ilike.%${filters.search}%,shortName.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
        );
      }

      const hasSportTypeId = filters?.sportTypeId !== null && filters?.sportTypeId !== undefined;
      if (hasSportTypeId) {
        query = query.eq('sportTypeId', filters.sportTypeId);
      }

      const { data: eventsData, error } = await query;

      if (error) {
        return createError({ message: error.message });
      }

      if (!eventsData || eventsData.length === 0) {
        return createSuccess({ data: [] });
      }

      const venueMapResult = await getVenueMap();
      if (!venueMapResult.success || !venueMapResult.data) {
        return createError({ message: venueMapResult.error || 'Unable to load venue information' });
      }
      const venueMap = venueMapResult.data;

      const events: Event[] = eventsData.map(event => ({
        id: event.id,
        fullName: event.fullName,
        shortName: event.shortName,
        description: event.description || '',
        sportTypeId: event.sportTypeId,
        date: event.date,
        venues: (event.venueIds || []).map((id: number) => venueMap.get(id) || '').filter(Boolean),
      }));

      return createSuccess({ data: events });
    },
    fallbackError: 'Failed to fetch events',
  });
}

/**
 * Fetches a single event by ID from the database.
 * Returns the event with venue IDs converted to venue names.
 *
 * @param params - Parameters object
 * @param params.eventId - ID of the event to fetch
 * @returns Result containing the event with venue names populated, or error if not found
 */
export async function getEvent({ eventId }: { eventId: number }): Promise<DbResult<Event>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      const eventResult = handleSupabaseError({
        data: eventData,
        error,
        fallbackError: 'Event not found',
      });
      if (!eventResult.success || !eventData) {
        return eventResult;
      }

      const venueMapResult = await getVenueMap();
      if (!venueMapResult.success || !venueMapResult.data) {
        return createError({ message: venueMapResult.error || 'Unable to load venue information' });
      }
      const venueMap = venueMapResult.data;

      const event: Event = {
        id: eventData.id,
        fullName: eventData.fullName,
        shortName: eventData.shortName,
        description: eventData.description || '',
        sportTypeId: eventData.sportTypeId,
        date: eventData.date,
        venues: (eventData.venueIds || [])
          .map((id: number) => venueMap.get(id) || '')
          .filter(Boolean),
      };

      return createSuccess({ data: event });
    },
    fallbackError: 'Failed to fetch event',
  });
}
