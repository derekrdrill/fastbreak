export interface Venue {
  id: number;
  name: string;
}

export interface EventDB {
  id: number;
  fullName: string;
  shortName: string;
  description: string;
  sportTypeId: number;
  date: string;
  venueIds: number[];
}

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
