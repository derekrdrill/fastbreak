'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { IoAdd, IoTrash } from 'react-icons/io5';
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
import { createEvent, updateEvent } from '@/app/_actions/events';
import type { Event, Venue } from '@/app/_lib/types';

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
  venues: Venue[];
  event?: Event;
}

export default function EventForm({ venues, event }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: event
      ? {
          fullName: event.fullName,
          shortName: event.shortName,
          sportType: SPORTS.find(s => s.id === event.sportTypeId)?.name,
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

  const venuesArray = form.watch('venues');

  const addVenue = () => {
    form.setValue('venues', [...venuesArray, '']);
  };

  const removeVenue = (index: number) => {
    form.setValue(
      'venues',
      venuesArray.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    let result;
    if (event) {
      // Update existing event
      const sport = SPORTS.find(s => s.name === values.sportType);
      if (!sport) {
        toast.error('Invalid sport type');
        setIsSubmitting(false);
        return;
      }

      result = await updateEvent({
        id: event.id,
        fullName: values.fullName,
        shortName: values.shortName,
        sportTypeId: sport.id,
        date: values.date,
        venues: values.venues,
      });
    } else {
      // Create new event with all venues
      result = await createEvent({
        fullName: values.fullName,
        shortName: values.shortName,
        sportType: values.sportType,
        date: values.date,
        venueNames: values.venues,
      });
    }

    setIsSubmitting(false);

    if (result.success) {
      toast.success(event ? 'Event updated successfully!' : 'Event created successfully!');
      router.push('/dashboard');
    } else {
      toast.error(result.error || `Failed to ${event ? 'update' : 'create'} event`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
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
          {venuesArray?.map((_, index) => (
            <div key={index} className='flex gap-2 mt-2 items-start'>
              <FormField
                control={form.control}
                name={`venues.${index}`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <div className='relative'>
                        <Input placeholder='Enter venue' list='venues-list' {...field} />
                        <datalist id='venues-list'>
                          {venues?.map(venue => (
                            <option key={venue.id} value={venue.name} />
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {venuesArray?.length && (
                <button
                  type='button'
                  onClick={() => removeVenue(index)}
                  className='p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center'
                  aria-label='Remove venue'
                  title='Remove venue'
                >
                  <IoTrash className='w-5 h-5' />
                </button>
              )}
            </div>
          ))}
          <button
            type='button'
            onClick={addVenue}
            className='mt-3 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-all duration-200 hover:shadow-md active:scale-95 flex items-center gap-2 font-medium'
            aria-label='Add venue'
          >
            <IoAdd className='w-5 h-5' />
            Add Venue
          </button>
        </div>
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-[0.99] font-semibold'
        >
          {isSubmitting
            ? event
              ? 'Updating...'
              : 'Creating...'
            : event
              ? 'Update Event'
              : 'Create Event'}
        </button>
      </form>
    </Form>
  );
}
