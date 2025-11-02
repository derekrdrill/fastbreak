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

export async function deleteEvent(eventId: number): Promise<DbResult<null>> {
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

export async function getEvents(filters?: {
  search?: string;
  sportTypeId?: number | null;
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

      if (filters?.sportTypeId !== null && filters?.sportTypeId !== undefined) {
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

export async function getEvent(eventId: number): Promise<DbResult<Event>> {
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
