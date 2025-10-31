// TODO: Define TypeScript types/interfaces for the application
// Event types
// User types
// Database response types
// Form types

export interface Event {
  id: string;
  name: string;
  sportType: string;
  date: Date;
  description: string;
  venues: string[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export type SportType =
  | 'Soccer'
  | 'Basketball'
  | 'Tennis'
  | 'Football'
  | 'Baseball'
  | 'Hockey'
  | 'Volleyball'
  | 'Other';

