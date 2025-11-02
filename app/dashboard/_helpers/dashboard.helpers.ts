import { SPORTS } from '@/app/_constants/events';
import type { Event } from '@/app/_types';

/**
 * Formats venue data into a comma-separated string.
 * Handles both single string and array of strings, joining arrays with ", ".
 *
 * @param params - Object containing venues data
 * @param params.venues - Single venue name or array of venue names
 * @returns Formatted string of venues (comma-separated if array, otherwise as-is)
 */
function getFormattedVenues({ venues }: { venues: string[] | string }) {
  return Array.isArray(venues) ? venues.join(', ') : venues;
}

/**
 * Groups events by sport type and returns sections containing sport info and filtered events.
 * Only includes sections that have at least one event matching the sport type.
 *
 * @param params - Object containing events to group
 * @param params.events - Array of events to group by sport type
 * @returns Array of sections, each containing a sport and its matching events
 */
function getEventsBySport({ events }: { events: Event[] }) {
  return SPORTS.map(sport => ({
    sport,
    events: events.filter(event => event.sportTypeId === sport.id),
  })).filter(section => section.events.length > 0);
}

export { getEventsBySport, getFormattedVenues };
