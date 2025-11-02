'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SPORTS } from '@/app/_constants/events';
import { Event } from '@/app/_lib/types';

const sports = SPORTS.map(sport => sport.name) as [string, ...string[]];

const formSchema = z.object({
  fullName: z.string().min(1, 'Event name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  sportType: z.enum(sports),
  date: z.string().min(1, 'Date is required'),
  venues: z.array(z.string()).min(1, 'At least one venue is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  event?: Event;
  onSubmit: (values: FormValues) => void;
}

export default function EventForm({ event, onSubmit }: EventFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: event
      ? {
          fullName: event.fullName,
          shortName: event.shortName,
          sportType: event.sportType,
          date: new Date(event.date).toISOString().slice(0, 16),
          venues: Array.isArray(event.venues) ? event.venues : [event.venues],
        }
      : {
          fullName: '',
          shortName: '',
          sportType: undefined,
          date: '',
          venues: [''],
        },
  });

  const venues = form.watch('venues');

  const addVenue = () => {
    form.setValue('venues', [...venues, '']);
  };

  const removeVenue = (index: number) => {
    form.setValue(
      'venues',
      venues.filter((_, i) => i !== index),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter full name (e.g. Los Angeles Lakers vs. Boston Celtics)'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='shortName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter short name (e.g. LAL v BOS)' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sportType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select sport type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <label className='text-sm font-medium'>Venues</label>
          {venues.map((_, index) => (
            <div key={index} className='flex gap-2 mt-2'>
              <FormField
                control={form.control}
                name={`venues.${index}`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Enter venue' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {venues.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeVenue(index)}
                  className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type='button'
            onClick={addVenue}
            className='mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
          >
            Add Venue
          </button>
        </div>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </Form>
  );
}
