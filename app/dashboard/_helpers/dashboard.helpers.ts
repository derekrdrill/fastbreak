import { SPORTS } from '@/app/_constants/events';
import type { Event } from '@/app/_lib/types';

function getFormattedVenues({ venues }: { venues: string[] | string }) {
  return Array.isArray(venues) ? venues.join(', ') : venues;
}

function getEventsBySport({ events }: { events: Event[] }) {
  return SPORTS.map(sport => ({
    sport,
    events: events.filter(event => event.sportTypeId === sport.id),
  })).filter(section => section.events.length > 0);
}

export { getEventsBySport, getFormattedVenues };
