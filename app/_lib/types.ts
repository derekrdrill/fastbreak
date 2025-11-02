// TODO: Define TypeScript types/interfaces for the application
// Event types
// User types
// Database response types
// Form types

export interface Event {
  id: number;
  fullName: string;
  shortName: string;
  sportType: SportType;
  date: Date;
  venues: string | string[];
}

export type DashboardView = 'card' | 'list';

export type SportType =
  | 'Soccer'
  | 'Basketball'
  | 'Tennis'
  | 'Football'
  | 'Baseball'
  | 'Hockey'
  | 'Volleyball'
  | 'Other';
