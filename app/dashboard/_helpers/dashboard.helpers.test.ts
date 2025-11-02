import { getFormattedVenues, getEventsBySport } from './dashboard.helpers';
import type { Event } from '@/app/_types';

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
    const mockEvents: Event[] = [
      {
        id: 1,
        fullName: 'Los Angeles Lakers vs Boston Celtics',
        shortName: 'LAL v BOS',
        description: 'Basketball game',
        sportTypeId: 1,
        date: '2024-01-15T19:00:00Z',
        venues: ['Staples Center'],
      },
      {
        id: 2,
        fullName: 'New York Yankees vs Boston Red Sox',
        shortName: 'NYY v BOS',
        description: 'Baseball game',
        sportTypeId: 2,
        date: '2024-01-16T19:00:00Z',
        venues: ['Yankee Stadium'],
      },
      {
        id: 3,
        fullName: 'Golden State Warriors vs Miami Heat',
        shortName: 'GSW v MIA',
        description: 'Basketball game',
        sportTypeId: 1,
        date: '2024-01-17T20:00:00Z',
        venues: ['Chase Center'],
      },
    ];

    it('should return sections with sport and events properties', () => {
      const result = getEventsBySport({ events: mockEvents });

      expect(Array.isArray(result)).toBe(true);
      result.forEach(section => {
        expect(section).toHaveProperty('sport');
        expect(section).toHaveProperty('events');
        expect(Array.isArray(section.events)).toBe(true);
      });
    });

    it('should filter events by sportTypeId matching sport id', () => {
      const result = getEventsBySport({ events: mockEvents });

      result.forEach(section => {
        section.events.forEach(event => {
          expect(event.sportTypeId).toBe(section.sport.id);
        });
      });
    });

    it('should only include sections with events', () => {
      const result = getEventsBySport({ events: mockEvents });

      result.forEach(section => {
        expect(section.events.length).toBeGreaterThan(0);
      });
    });

    it('should return empty array when no events match any sport', () => {
      const emptyEvents: Event[] = [];
      const result = getEventsBySport({ events: emptyEvents });

      expect(result).toEqual([]);
    });

    it('should group multiple events by the same sport', () => {
      const result = getEventsBySport({ events: mockEvents });

      const basketballSection = result.find(section => section.sport.id === 1);
      expect(basketballSection).toBeDefined();
      if (basketballSection) {
        expect(basketballSection.events.length).toBe(2);
      }
    });
  });
});
