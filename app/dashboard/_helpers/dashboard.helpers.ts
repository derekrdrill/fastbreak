import { EVENTS, SPORTS } from '@/app/_constants/events';

function getFormattedVenues({ venues }: { venues: string[] | string }) {
  return Array.isArray(venues) ? venues.join(', ') : venues;
}

function getEventsBySport({
  searchQuery = '',
  sportFilter = null,
}: {
  searchQuery?: string;
  sportFilter?: number | null;
} = {}) {
  const filteredEvents = EVENTS.filter(event => {
    const matchesSearch =
      !searchQuery ||
      event.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSport = sportFilter === null || event.sportType === sportFilter;

    return matchesSearch && matchesSport;
  });

  return SPORTS.map(sport => ({
    sport,
    events: filteredEvents.filter(event => event.sportType === sport.id),
  })).filter(section => section.events.length > 0);
}

export { getEventsBySport, getFormattedVenues };
