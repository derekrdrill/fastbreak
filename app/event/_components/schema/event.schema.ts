import * as z from 'zod';
import { SPORTS } from '@/constants';

export const sports = SPORTS.map(sport => sport.name) as [string, ...string[]];

export const formSchema = z.object({
  fullName: z.string().min(1, 'Event name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().optional(),
  sportType: z.enum(sports),
  date: z.string().min(1, 'Date is required'),
  venues: z.array(z.string()).min(1, 'At least one venue is required'),
});

export type FormValues = z.infer<typeof formSchema>;


