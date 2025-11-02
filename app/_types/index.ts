// Database types
export interface Venue {
  id: number;
  name: string;
}

// Database schema - what's actually stored in Supabase
export interface EventDB {
  id: number;
  fullName: string;
  shortName: string;
  description: string;
  sportTypeId: number;
  date: string;
  venueIds: number[];
}

// UI type - what we work with in the frontend (with venue names populated)
export interface Event {
  id: number;
  fullName: string;
  shortName: string;
  description?: string;
  sportTypeId: number;
  date: string;
  venues: string[];
}

export interface User {
  id: string;
  email: string;
}

// UI types
export type DashboardView = 'card' | 'list';

export type DbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type SportType =
  | 'Soccer'
  | 'Basketball'
  | 'Tennis'
  | 'Football'
  | 'Baseball'
  | 'Hockey'
  | 'Volleyball'
  | 'Other';
