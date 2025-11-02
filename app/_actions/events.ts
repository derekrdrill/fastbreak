'use server';

import {
  getSupabaseClient,
  resolveVenueIds,
  getVenueMap,
  type DbResult,
} from '@/app/_lib/db-helpers';
import type { Event } from '@/app/_lib/types';

export async function createEvent({
  fullName,
  shortName,
  sportType,
  date,
  venueNames,
}: {
  fullName: string;
  shortName: string;
  sportType: string;
  date: string;
  venueNames: string[];
}): Promise<DbResult<Event>> {
  try {
    const supabase = await getSupabaseClient();

    // Convert sport name to ID
    const { SPORTS } = await import('@/app/_constants/events');
    const sport = SPORTS.find(s => s.name === sportType);
    if (!sport) {
      return { success: false, error: 'Invalid sport type' };
    }

    // Convert venue names to IDs (find or create each venue)
    const venueIds: number[] = [];
    const venueNamesStored: string[] = [];

    for (const venueName of venueNames) {
      const { data: existingVenue } = await supabase
        .from('venues')
        .select('id, name')
        .ilike('name', venueName)
        .single();

      if (existingVenue) {
        venueIds.push(Number(existingVenue.id));
        venueNamesStored.push(existingVenue.name);
      } else {
        // Create new venue
        const { data: newVenue, error: venueError } = await supabase
          .from('venues')
          .insert({ name: venueName })
          .select('id, name')
          .single();

        if (venueError || !newVenue) {
          return { success: false, error: 'Failed to create venue' };
        }

        venueIds.push(Number(newVenue.id));
        venueNamesStored.push(newVenue.name);
      }
    }

    // Create event with venueIds array
    const { data: eventData, error } = await supabase
      .from('events')
      .insert({
        fullName,
        shortName,
        sportTypeId: sport.id,
        date,
        venueIds,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Return UI-friendly Event type with venue names
    const event: Event = {
      id: eventData.id,
      fullName: eventData.fullName,
      shortName: eventData.shortName,
      sportTypeId: eventData.sportTypeId,
      date: eventData.date,
      venues: venueNamesStored,
    };

    return { success: true, data: event };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event',
    };
  }
}

export async function updateEvent({
  id,
  fullName,
  shortName,
  sportTypeId,
  venues,
  date,
}: Event): Promise<DbResult<Event>> {
  try {
    const supabase = await getSupabaseClient();

    // Convert venue names to IDs (find or create each venue)
    const venuesResult = await resolveVenueIds(venues);
    if (!venuesResult.success || !venuesResult.data) {
      return { success: false, error: venuesResult.error || 'Failed to resolve venues' };
    }
    const { venueIds } = venuesResult.data;

    // Update event with venueIds array
    const { data: eventData, error } = await supabase
      .from('events')
      .update({
        fullName,
        shortName,
        sportTypeId,
        date,
        venueIds,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Return UI-friendly Event type with venue names
    const event: Event = {
      id: eventData.id,
      fullName: eventData.fullName,
      shortName: eventData.shortName,
      sportTypeId: eventData.sportTypeId,
      date: eventData.date,
      venues,
    };

    return { success: true, data: event };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event',
    };
  }
}

export async function deleteEvent(eventId: number): Promise<DbResult<null>> {
  // TODO: Delete event from Supabase
  // Use type-safe helper for database operations
  // Return success/error with proper error handling
  return { success: false, error: 'Not implemented' };
}

export async function getEvents(filters?: {
  search?: string;
  sportType?: string;
}): Promise<DbResult<Event[]>> {
  try {
    const supabase = await getSupabaseClient();

    let query = supabase.from('events').select('*').order('date', { ascending: true });

    // Apply filters if provided
    if (filters?.search) {
      query = query.or(`fullName.ilike.%${filters.search}%,shortName.ilike.%${filters.search}%`);
    }

    if (filters?.sportType) {
      const { SPORTS } = await import('@/app/_constants/events');
      const sport = SPORTS.find(s => s.name === filters.sportType);
      if (sport) {
        query = query.eq('sportTypeId', sport.id);
      }
    }

    const { data: eventsData, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    if (!eventsData || eventsData.length === 0) {
      return { success: true, data: [] };
    }

    // Convert venueIds to venue names
    const venueMap = await getVenueMap();

    // Transform events to UI format
    const events: Event[] = eventsData.map(event => ({
      id: event.id,
      fullName: event.fullName,
      shortName: event.shortName,
      sportTypeId: event.sportTypeId,
      date: event.date,
      venues: (event.venueIds || []).map((id: number) => venueMap.get(id) || '').filter(Boolean),
    }));

    return { success: true, data: events };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch events',
    };
  }
}

export async function getEvent(eventId: number): Promise<DbResult<Event>> {
  try {
    const supabase = await getSupabaseClient();

    const { data: eventData, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!eventData) {
      return { success: false, error: 'Event not found' };
    }

    // Convert venueIds to venue names
    const venueMap = await getVenueMap();

    // Transform to UI format
    const event: Event = {
      id: eventData.id,
      fullName: eventData.fullName,
      shortName: eventData.shortName,
      sportTypeId: eventData.sportTypeId,
      date: eventData.date,
      venues: (eventData.venueIds || [])
        .map((id: number) => venueMap.get(id) || '')
        .filter(Boolean),
    };

    return { success: true, data: event };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch event',
    };
  }
}
