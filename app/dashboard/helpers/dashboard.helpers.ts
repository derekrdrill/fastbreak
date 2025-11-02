import { EVENTS, SPORTS } from '@/app/_constants/events';

function getFormattedVenues({ venues }: { venues: string[] | string }) {
  return Array.isArray(venues) ? venues.join(', ') : venues;
}

function getEventsBySport() {
  return SPORTS.map(sport => ({
    sport,
    events: EVENTS.filter(event => event.sportType === sport.id),
  })).filter(section => section.events.length > 0);
}

export { getEventsBySport, getFormattedVenues };
