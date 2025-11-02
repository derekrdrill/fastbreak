import { SPORTS } from '@/app/_constants/events';
import type { Event } from '@/app/_lib/types';

function getFormattedVenues({ venues }: { venues: string[] | string }) {
  return Array.isArray(venues) ? venues.join(', ') : venues;
}

function getEventsBySport({
  events,
  searchQuery = '',
  sportFilter = null,
}: {
  events: Event[];
  searchQuery?: string;
  sportFilter?: number | null;
}) {
  const filteredEvents = events.filter(event => {
    const matchesSearch =
      !searchQuery ||
      event.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSport = sportFilter === null || event.sportTypeId === sportFilter;

    return matchesSearch && matchesSport;
  });

  return SPORTS.map(sport => ({
    sport,
    events: filteredEvents.filter(event => event.sportTypeId === sport.id),
  })).filter(section => section.events.length > 0);
}

export { getEventsBySport, getFormattedVenues };
