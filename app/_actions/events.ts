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
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    // Convert sport name to ID
    const { SPORTS } = await import('@/app/_constants/events');
    const sport = SPORTS.find(s => s.name === sportType);
    if (!sport) {
      return validationError(`Invalid sport type: "${sportType}" is not recognized`);
    }

    // Convert venue names to IDs using helper
    const venuesResult = await resolveVenueIds(venueNames);
    if (!venuesResult.success || !venuesResult.data) {
      return createError(venuesResult.error || 'Unable to process venue information');
    }
    const { venueIds, venueNames: venueNamesStored } = venuesResult.data;

    // Create event with venueIds array
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

    const eventResult = handleSupabaseError(
      eventData,
      error,
      'Unable to create event. Please try again or check your input.',
    );
    if (!eventResult.success) {
      return eventResult;
    }

    // Return UI-friendly Event type with venue names
    const event: Event = {
      id: eventData.id,
      fullName: eventData.fullName,
      shortName: eventData.shortName,
      description: eventData.description || '',
      sportTypeId: eventData.sportTypeId,
      date: eventData.date,
      venues: venueNamesStored,
    };

    return createSuccess(event);
  }, 'Failed to create event');
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
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    // Convert venue names to IDs using helper
    const venuesResult = await resolveVenueIds(venues);
    if (!venuesResult.success || !venuesResult.data) {
      return createError(venuesResult.error || 'Unable to process venue information');
    }
    const { venueIds } = venuesResult.data;

    // Update event with venueIds array
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

    const eventResult = handleSupabaseError(
      eventData,
      error,
      'Unable to update event. The event may not exist or you may not have permission.',
    );
    if (!eventResult.success) {
      return eventResult;
    }

    // Return UI-friendly Event type with venue names
    const event: Event = {
      id: eventData.id,
      fullName: eventData.fullName,
      shortName: eventData.shortName,
      description: eventData.description || '',
      sportTypeId: eventData.sportTypeId,
      date: eventData.date,
      venues,
    };

    return createSuccess(event);
  }, 'Failed to update event');
}

export async function deleteEvent(eventId: number): Promise<DbResult<null>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    // Check if event exists
    const { data: existingEvent, error: findError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .maybeSingle();

    if (findError) {
      return createError('Unable to verify event exists');
    }

    if (!existingEvent) {
      return notFound('Event not found. It may have been deleted or does not exist.');
    }

    // Delete the event and verify deletion
    const { data: deletedData, error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .select();

    if (deleteError) {
      return createError(deleteError.message || 'Unable to delete event. Please try again.');
    }

    // Verify deletion succeeded
    if (!deletedData || deletedData.length === 0) {
      return createError(
        'Event could not be deleted. You may not have permission to delete this event.',
      );
    }

    return createSuccess(null);
  }, 'Failed to delete event');
}

export async function getEvents(filters?: {
  search?: string;
  sportTypeId?: number | null;
}): Promise<DbResult<Event[]>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    let query = supabase.from('events').select('*').order('date', { ascending: true });

    // Apply filters if provided
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
      return createError(error.message);
    }

    if (!eventsData || eventsData.length === 0) {
      return createSuccess([]);
    }

    // Convert venueIds to venue names
    const venueMapResult = await getVenueMap();
    if (!venueMapResult.success || !venueMapResult.data) {
      return createError(venueMapResult.error || 'Unable to load venue information');
    }
    const venueMap = venueMapResult.data;

    // Transform events to UI format
    const events: Event[] = eventsData.map(event => ({
      id: event.id,
      fullName: event.fullName,
      shortName: event.shortName,
      description: event.description || '',
      sportTypeId: event.sportTypeId,
      date: event.date,
      venues: (event.venueIds || []).map((id: number) => venueMap.get(id) || '').filter(Boolean),
    }));

    return createSuccess(events);
  }, 'Failed to fetch events');
}

export async function getEvent(eventId: number): Promise<DbResult<Event>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const { data: eventData, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    const eventResult = handleSupabaseError(eventData, error, 'Event not found');
    if (!eventResult.success || !eventData) {
      return eventResult;
    }

    // Convert venueIds to venue names
    const venueMapResult = await getVenueMap();
    if (!venueMapResult.success || !venueMapResult.data) {
      return createError(venueMapResult.error || 'Unable to load venue information');
    }
    const venueMap = venueMapResult.data;

    // Transform to UI format
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

    return createSuccess(event);
  }, 'Failed to fetch event');
}
