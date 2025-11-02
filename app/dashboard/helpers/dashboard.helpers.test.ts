import { getFormattedVenues, getEventsBySport } from './dashboard.helpers';

describe('dashboard.helpers', () => {
  describe('getFormattedVenues', () => {
    it('should return a string when venues is a string', () => {
      const result = getFormattedVenues({ venues: 'Single Venue' });
      expect(result).toBe('Single Venue');
    });

    it('should return a comma-separated string when venues is an array', () => {
      const result = getFormattedVenues({ venues: ['Venue 1', 'Venue 2'] });
      expect(result).toBe('Venue 1, Venue 2');
    });
  });

  describe('getEventsBySport', () => {
    it('should return sections with sport and events properties', () => {
      const result = getEventsBySport();

      expect(Array.isArray(result)).toBe(true);
      result.forEach(section => {
        expect(section).toHaveProperty('sport');
        expect(section).toHaveProperty('events');
        expect(Array.isArray(section.events)).toBe(true);
      });
    });

    it('should filter events by sportType matching sport id', () => {
      const result = getEventsBySport();

      result.forEach(section => {
        section.events.forEach(event => {
          expect(event.sportType).toBe(section.sport.id);
        });
      });
    });

    it('should only include sections with events', () => {
      const result = getEventsBySport();

      result.forEach(section => {
        expect(section.events.length).toBeGreaterThan(0);
      });
    });
  });
});
