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

export interface User {
  id: string;
  email: string;
  // TODO: Add more user fields as needed (name, avatar, etc.)
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
