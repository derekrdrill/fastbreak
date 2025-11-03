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

/**
 * Builds a `/dashboard` URL with updated query parameters.
 * If `value` is empty after trimming, the param is removed; otherwise it is set.
 *
 * @param params - Object of arguments
 * @param params.currentParams - Existing query params as `URLSearchParams` or a raw query string (e.g. `"a=1&b=2"`)
 * @param params.key - The query parameter key to set or delete
 * @param params.value - The value to apply (will be trimmed); deleted if empty after trim
 * @returns A URL string pointing to `/dashboard` with the updated querystring
 *
 * @example
 * // Adds `search=hello` to existing params
 * getDashboardUrlWithParam({ currentParams: 'foo=bar', key: 'search', value: '  hello ' });
 * // -> '/dashboard?foo=bar&search=hello'
 *
 * @example
 * // Removes `search` if value is empty after trim
 * getDashboardUrlWithParam({ currentParams: 'search=hello&x=1', key: 'search', value: '   ' });
 * // -> '/dashboard?x=1'
 */
function getDashboardUrlWithParam({
  currentParams,
  key,
  value,
}: {
  currentParams: URLSearchParams | string;
  key: string;
  value: string;
}) {
  const params = new URLSearchParams(
    typeof currentParams === 'string' ? currentParams : currentParams.toString(),
  );
  const next = value.trim();
  if (next) params.set(key, next);
  else params.delete(key);
  const str = params.toString();
  return str ? `/dashboard?${str}` : '/dashboard';
}

export { getDashboardUrlWithParam };
